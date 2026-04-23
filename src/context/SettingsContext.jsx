import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('Settings')
        .select('*')
        .eq('id', 'global')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found, initialize it
          const initialSettings = {
            id: 'global',
            hotel_name: 'Golden Hills Hotel Setif',
            address: 'Blvd des Orangers, Setif, Algeria',
            contact_email: 'contact@goldenhills.dz',
            contact_phone: '+213 36 00 00 00',
            language: 'English',
            timezone: '(GMT+01:00) Algiers, Casablanca, Tunis',
            currency: 'DZD',
            brand_color_primary: '#D4AF37',
            brand_color_secondary: '#002349',
            font_family: 'Inter',
            hero_image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070',
            password_min_length: 8,
            session_timeout: 30,
            two_factor_enabled: false,
            data_retention_days: 365,
            email_notifications_reservations: true,
            email_notifications_stock: true,
            email_notifications_staff: false
          };

          const { data: newData, error: insertError } = await supabase
            .from('Settings')
            .insert([initialSettings])
            .select()
            .single();

          if (!insertError) {
            setSettings(newData);
          }
        } else {
          console.error('Error fetching settings:', error);
        }
      } else {
        setSettings(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    const subscription = supabase
      .channel('public:Settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Settings' }, payload => {
        if (payload.new && payload.new.id === 'global') {
          setSettings(payload.new);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    if (settings) {
      if (settings.brand_color_primary) {
        document.documentElement.style.setProperty('--luxury-gold', settings.brand_color_primary);
      }
      // Apply other dynamic styles if needed
    }
  }, [settings]);

  const updateSettings = async (updates) => {
    const { data, error } = await supabase
      .from('Settings')
      .update(updates)
      .eq('id', 'global')
      .select()
      .single();

    if (!error && data) {
      setSettings(data);
      return { success: true, data };
    }
    return { success: false, error };
  };

  const value = {
    settings,
    loading,
    updateSettings,
    refreshSettings: fetchSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

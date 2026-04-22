-- Phase 3: Financial Integrity & Bank Transfers

-- Create BankAccount table
CREATE TABLE IF NOT EXISTS "BankAccount" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "bank_name" TEXT NOT NULL,
    "account_holder" TEXT NOT NULL,
    "iban" TEXT NOT NULL UNIQUE,
    "rib" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create PaymentRequest table
CREATE TABLE IF NOT EXISTS "PaymentRequest" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "reservation_id" UUID REFERENCES "Reservation"("id") ON DELETE CASCADE,
    "guest_id" UUID REFERENCES "Guest"("id"),
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT DEFAULT 'DZD',
    "status" TEXT DEFAULT 'Pending', -- Pending, Verified, Rejected
    "proof_url" TEXT, -- URL to the uploaded transfer proof (image/pdf)
    "reference_number" TEXT, -- External transfer reference
    "notes" TEXT,
    "verified_by" TEXT REFERENCES "Staff"("id"),
    "verified_at" TIMESTAMP WITH TIME ZONE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add payment fields to Reservation
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "payment_status" TEXT DEFAULT 'Unpaid';
ALTER TABLE "Reservation" ADD COLUMN IF NOT EXISTS "payment_method" TEXT DEFAULT 'Bank Transfer';

-- Enable RLS
ALTER TABLE "BankAccount" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PaymentRequest" ENABLE ROW LEVEL SECURITY;

-- Permissive policies for development
CREATE POLICY "Full access for all" ON "BankAccount" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full access for all" ON "PaymentRequest" FOR ALL USING (true) WITH CHECK (true);

-- Insert a default bank account for testing
INSERT INTO "BankAccount" (bank_name, account_holder, iban, rib)
VALUES ('Banque de l''Agriculture et du Développement Rural (BADR)', 'Golden Hills Hotel Sétif', 'DZ01 0000 1234 5678 9012 34', '003 00000 1234567890 12')
ON CONFLICT (iban) DO NOTHING;

-- Add realtime support
ALTER PUBLICATION supabase_realtime ADD TABLE "BankAccount", "PaymentRequest";

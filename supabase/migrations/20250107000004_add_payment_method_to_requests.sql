-- Add payment_method_id column to payment_requests table
ALTER TABLE payment_requests
ADD COLUMN payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX idx_payment_requests_payment_method_id ON payment_requests(payment_method_id);

-- Add comment
COMMENT ON COLUMN payment_requests.payment_method_id IS 'The payment method selected by the user for this request';

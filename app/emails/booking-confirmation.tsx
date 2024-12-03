import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import { format } from 'date-fns';

interface BookingConfirmationEmailProps {
  customerName: string;
  serviceName: string;
  booking_datetime: string;
  duration: number;
  provider_id: string;
  price: number;
}

export const BookingConfirmationEmail = ({
  customerName,
  serviceName,
  booking_datetime,
  duration,
  provider_id,
  price,
}: BookingConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Booking Confirmation: {serviceName} with {provider_id}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Confirmation</Heading>
          <Text style={greeting}>Dear {customerName},</Text>
          <Text style={text}>
            Thank you for choosing our services. Your appointment has been successfully confirmed. Please review the details below:
          </Text>
          <Container style={detailsContainer}>
            <Text style={details}>
              <strong style={detailLabel}>Service:</strong>{' '}
              <span style={detailValue}>{serviceName}</span>
              <br />
              <strong style={detailLabel}>Provider:</strong>{' '}
              <span style={detailValue}>{provider_id}</span>
              <br />
              <strong style={detailLabel}>Date & Time:</strong>{' '}
              <span style={detailValue}>{booking_datetime}</span>
              <br />
              <strong style={detailLabel}>Duration:</strong>{' '}
              <span style={detailValue}>{duration} minutes</span>
              <br />
              <strong style={detailLabel}>Price:</strong>{' '}
              <span style={detailValue}>${price}</span>
            </Text>
          </Container>
          <Text style={text}>
            If you need to reschedule or cancel your appointment, please contact us at least 24 hours in advance. For any questions or assistance, our team is here to help.
          </Text>
          <Text style={reminderText}>
            We recommend arriving 5-10 minutes before your scheduled appointment time.
          </Text>
          <Text style={footer}>
            Best regards,
            <br />
            {provider_id}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
};

const h1 = {
  color: '#2c3e50',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
  padding: '0',
  borderBottom: '1px solid #eaeaea',
  paddingBottom: '20px',
};

const greeting = {
  color: '#2c3e50',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '20px',
};

const text = {
  color: '#34495e',
  fontSize: '15px',
  lineHeight: '24px',
  marginBottom: '20px',
};

const detailsContainer = {
  backgroundColor: '#f8f9fa',
  padding: '24px',
  borderRadius: '6px',
  margin: '25px 0',
  border: '1px solid #eaeaea',
};

const details = {
  ...text,
  margin: 0,
};

const detailLabel = {
  color: '#2c3e50',
  width: '120px',
  display: 'inline-block',
  fontWeight: '600',
};

const detailValue = {
  color: '#34495e',
  fontWeight: '500',
};

const reminderText = {
  ...text,
  backgroundColor: '#e1f5fe',
  padding: '15px',
  borderRadius: '6px',
  fontSize: '14px',
  color: '#0277bd',
};

const footer = {
  ...text,
  textAlign: 'center' as const,
  color: '#7f8c8d',
  fontSize: '14px',
  marginTop: '30px',
  borderTop: '1px solid #eaeaea',
  paddingTop: '20px',
};

export default BookingConfirmationEmail; 
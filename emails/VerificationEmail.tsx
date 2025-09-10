import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import { Font } from '@react-email/font';
import { Preview } from '@react-email/preview';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import { Button } from '@react-email/button';
import { Heading } from '@react-email/heading';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Here&apos;s your verification code: {otp}</Preview>

      <Section>
        <Heading as="h2">Hello {username},</Heading>

        <Text>
          Thank you for registering. Please use the following verification code to
          complete your registration:
        </Text>

        <Text style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px' }}>
          {otp}
        </Text>

        <Text>If you did not request this code, please ignore this email.</Text>

        {/* Optional CTA */}
        {/* <Button
          href={`http://localhost:3000/verify/${username}`}
          style={{
            backgroundColor: '#61dafb',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          Verify here
        </Button> */}
      </Section>
    </Html>
  );
}

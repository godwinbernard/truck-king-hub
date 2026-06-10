import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy | Truck King Hub',
    description:
      'Privacy Policy for Truck King Hub. Learn what data we collect, how we use cookies, our Google Analytics disclosure, and your rights under CCPA.',
  };
}

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-4">
    <span
      style={{
        background: '#F5C518',
        width: 4,
        height: 28,
        display: 'inline-block',
        borderRadius: 2,
        flexShrink: 0,
      }}
    />
    <h2
      className="text-xl font-bold uppercase"
      style={{ fontFamily: 'Impact, sans-serif', color: '#ffffff' }}
    >
      {children}
    </h2>
  </div>
);

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl sm:text-5xl mb-4 uppercase"
            style={{ fontFamily: 'Impact, sans-serif', color: '#F5C518' }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            Effective Date: June 1, 2025 &nbsp;|&nbsp; Last Updated: June 1, 2025
          </p>
          <p className="mt-4 leading-relaxed" style={{ color: '#d1d5db' }}>
            Truck King Hub (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your
            privacy. This Privacy Policy explains how we handle information when you visit{' '}
            <span style={{ color: '#F5C518' }}>truckkinghub.com</span> (the &ldquo;Site&rdquo;). Please read this
            policy carefully.
          </p>
        </div>

        <div className="space-y-12">

          {/* 1. Information We Collect */}
          <section>
            <SectionHeading>1. Information We Collect</SectionHeading>
            <p className="leading-relaxed mb-4" style={{ color: '#d1d5db' }}>
              We collect minimal information necessary to operate the Site and understand how readers use it.
              Specifically, we collect:
            </p>
            <ul className="space-y-3">
              {[
                'Usage Data: Pages visited, time on site, referral source, browser type, and general geographic location (country/region level). This data is collected anonymously through Google Analytics.',
                'Cookies: Small text files placed on your device to enable site functionality and analytics. See the Cookies section below.',
                'Voluntarily Submitted Information: If you contact us by email, we receive the information you include in that message (e.g., your name, email address, and message content). We do not operate contact forms that collect form-submitted data.',
                'No Account Data: We do not offer user accounts, registrations, or logins. We do not collect passwords, payment information, or sensitive personal data.',
              ].map((point) => (
                <li key={point.slice(0, 30)} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
                  <span style={{ color: '#F5C518', flexShrink: 0, marginTop: 2 }}>▸</span>
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* 2. Cookies */}
          <section>
            <SectionHeading>2. Cookies</SectionHeading>
            <p className="leading-relaxed mb-4" style={{ color: '#d1d5db' }}>
              We use the following types of cookies:
            </p>
            <div className="space-y-3">
              {[
                {
                  title: 'Analytics Cookies',
                  desc: 'Set by Google Analytics to track page views, session duration, and traffic sources. These cookies collect data in anonymized, aggregated form.',
                },
                {
                  title: 'Functional Cookies',
                  desc: 'Used to remember your preferences (such as display settings). These do not track you across other sites.',
                },
                {
                  title: 'Third-Party Advertising Cookies',
                  desc: 'If we run display advertising, third-party ad networks may set cookies to serve relevant ads. These are controlled by the respective ad network and governed by their own privacy policies.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg p-5"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                >
                  <h3 className="font-bold text-sm uppercase tracking-wide mb-1" style={{ color: '#F5C518' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
              You can control cookies through your browser settings. Disabling cookies may affect site functionality.
              Most browsers allow you to refuse new cookies, accept only certain cookies, or delete cookies already
              stored on your device.
            </p>
          </section>

          {/* 3. Google Analytics */}
          <section>
            <SectionHeading>3. Google Analytics</SectionHeading>
            <p className="leading-relaxed mb-4" style={{ color: '#d1d5db' }}>
              We use Google Analytics, a web analytics service provided by Google LLC, to understand how visitors
              interact with our Site. Google Analytics uses cookies to collect information such as:
            </p>
            <ul className="space-y-2 mb-4">
              {[
                'Number of visits and unique visitors',
                'Pages viewed and time spent on each page',
                'Traffic source (search, direct, referral)',
                'Device type, browser, and approximate geographic location (city/region level)',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm" style={{ color: '#d1d5db' }}>
                  <span style={{ color: '#F5C518', flexShrink: 0 }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed mb-3" style={{ color: '#d1d5db' }}>
              This data is transmitted to and stored by Google on servers in the United States. We have enabled IP
              anonymization, which means Google truncates IP addresses within EU member states and other EEA countries
              before transmitting them to Google&apos;s servers.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
              You can opt out of Google Analytics by installing the{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#F5C518', textDecoration: 'underline' }}
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              . Google&apos;s privacy policy is available at{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#F5C518', textDecoration: 'underline' }}
              >
                policies.google.com/privacy
              </a>
              .
            </p>
          </section>

          {/* 4. How We Use Information */}
          <section>
            <SectionHeading>4. How We Use Information</SectionHeading>
            <p className="leading-relaxed mb-3" style={{ color: '#d1d5db' }}>
              We use the information we collect solely to:
            </p>
            <ul className="space-y-2">
              {[
                'Operate and improve the Site and its content',
                'Understand which topics and articles are most useful to our readers',
                'Monitor site performance and diagnose technical problems',
                'Respond to emails or inquiries you send to us',
                'Measure the effectiveness of editorial and content strategy',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm" style={{ color: '#d1d5db' }}>
                  <span style={{ color: '#F5C518', flexShrink: 0 }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 5. No Sale of Data */}
          <section>
            <SectionHeading>5. We Do Not Sell Your Data</SectionHeading>
            <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
              We do not sell, rent, trade, or otherwise transfer your personal information to any third party for
              commercial purposes. We do not engage in data brokerage. Any information you provide by contacting us
              is used solely to respond to your inquiry and is never shared with marketing partners or advertisers.
            </p>
          </section>

          {/* 6. Third-Party Links */}
          <section>
            <SectionHeading>6. Third-Party Links</SectionHeading>
            <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
              Our Site contains links to external websites, including government agencies (FMCSA, DOT), industry
              organizations, freight platforms, and other third-party resources. We link to these sites as a service
              to our readers. We have no control over and assume no responsibility for the privacy practices or
              content of those sites. We encourage you to review the privacy policy of any site you visit via a
              link from Truck King Hub.
            </p>
          </section>

          {/* 7. CCPA */}
          <section>
            <SectionHeading>7. California Privacy Rights (CCPA)</SectionHeading>
            <p className="leading-relaxed mb-4" style={{ color: '#d1d5db' }}>
              If you are a California resident, you have the following rights under the California Consumer Privacy
              Act (CCPA):
            </p>
            <ul className="space-y-2 mb-4">
              {[
                'Right to Know: You may request information about the categories of personal information we collect and the purposes for which we use it.',
                'Right to Delete: You may request deletion of personal information we have collected about you.',
                'Right to Opt-Out of Sale: We do not sell personal information. This right is therefore not applicable.',
                'Right to Non-Discrimination: We will not discriminate against you for exercising any of your CCPA rights.',
              ].map((item) => (
                <li key={item.slice(0, 20)} className="flex gap-3 text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
                  <span style={{ color: '#F5C518', flexShrink: 0, marginTop: 2 }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
              To exercise your rights, contact us at{' '}
              <a href="mailto:info@truckkinghub.com" style={{ color: '#F5C518', textDecoration: 'underline' }}>
                info@truckkinghub.com
              </a>
              . We will respond within 45 days of receipt of your verifiable request.
            </p>
          </section>

          {/* 8. Data Security */}
          <section>
            <SectionHeading>8. Data Security</SectionHeading>
            <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
              We implement reasonable technical and organizational measures to protect the minimal information we
              collect. The Site is served over HTTPS. However, no method of transmission over the Internet is 100%
              secure. We cannot guarantee absolute security but take your privacy seriously and limit data collection
              to what is necessary.
            </p>
          </section>

          {/* 9. Children's Privacy */}
          <section>
            <SectionHeading>9. Children&apos;s Privacy</SectionHeading>
            <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
              Truck King Hub is not directed at children under the age of 13. We do not knowingly collect personal
              information from children. If we become aware that we have inadvertently collected information from a
              child under 13, we will delete it promptly.
            </p>
          </section>

          {/* 10. Changes */}
          <section>
            <SectionHeading>10. Changes to This Policy</SectionHeading>
            <p className="leading-relaxed" style={{ color: '#d1d5db' }}>
              We may update this Privacy Policy from time to time. When we do, we will revise the &ldquo;Last
              Updated&rdquo; date at the top of this page. We encourage you to review this policy periodically.
              Continued use of the Site after any changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <SectionHeading>11. Contact Us</SectionHeading>
            <p className="leading-relaxed mb-4" style={{ color: '#d1d5db' }}>
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div
              className="rounded-lg p-6"
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
            >
              <p className="font-bold mb-1" style={{ color: '#ffffff' }}>Truck King Hub</p>
              <p className="text-sm mb-1" style={{ color: '#d1d5db' }}>
                Privacy Inquiries:{' '}
                <a href="mailto:info@truckkinghub.com" style={{ color: '#F5C518', textDecoration: 'underline' }}>
                  info@truckkinghub.com
                </a>
              </p>
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                We aim to respond to all privacy inquiries within 5 business days.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

import React from 'react';
import styles from './privacy-policy.module.css';

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>TripSit Privacy Policy</h1>
      
      <div className={styles.contentBox}>
        <div className={styles.content}>
          <div className={styles.sectionBlock}>
            <p className={styles.paragraph}>
              This Privacy Policy explains how TripSit ("we," "our," or "us") collects, uses, and protects your information 
              when you use our website and services.
            </p>
          </div>

          <div className={styles.sectionBlock}>
          <br></br>
            <h2 className={styles.sectionTitle}>Information Collection and Usage</h2>
            <ul className={styles.list}>
              <li>
                By using TripSit, you acknowledge that any information you transmit should be considered non-confidential. 
                TripSit will not be liable if information belonging to you is intercepted or used by an unintended recipient.
              </li>
              <li>
                While TripSit does not monitor private communications, you should assume that other parties may log what they 
                see in public chats or private messages.
              </li>
              <li>
                By using our service, you agree that any information you enter in public chats or forums will be stored in our database.
              </li>
              <li>
                IP addresses may be recorded to aid in enforcing our terms and conditions.
              </li>
            </ul>
            <br></br>
          </div>

          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Cookies and Local Storage</h2>
            <p className={styles.paragraph}>
              Our website uses cookies to store information on your local computer. These cookies do not contain any registration 
              information you have entered; they serve only to improve your viewing experience.
            </p>
          </div>
          <br></br>
          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Privacy Protection</h2>
            <ul className={styles.list}>
              <li>
                TripSit provides a Tor hidden service to protect the identity of users. You are welcome to use this hidden 
                service at your own discretion.
              </li>
              <li>
                To prevent unauthorized access, maintain data accuracy, and ensure appropriate use of information, TripSit 
                has implemented physical, electronic, and managerial procedures to safeguard information collected online.
              </li>
              <li>
                While we take these precautions, please be aware that the managers cannot be held responsible for any hacking 
                attempt that may lead to data being compromised.
              </li>
            </ul>
          </div>
          <br></br>
          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Information Sharing</h2>
            <p className={styles.paragraph}>
              TripSit will not share your personal information (including but not limited to your name, email, and IP) with any 
              third party without your prior consent, with the following exception:
            </p>
            <ul className={styles.list}>
              <li>
                If you violate the TripSit User Agreement, TripSit may take necessary measures to ensure its security, including 
                publishing your information or sharing it with private investigators.
              </li>
            </ul>
          </div>
          <br></br>
          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Content Moderation</h2>
            <p className={styles.paragraph}>
              You agree that TripSit and its managers have the right to remove, edit, move, or close any submitted data at any 
              time should they choose to do so.
            </p>
          </div>
          <br></br>
          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Legal Compliance</h2>
            <ul className={styles.list}>
              <li>
                TripSit is an informational and community resource which does not advocate breaking any laws.
              </li>
              <li>
                Any unauthorized access to this system is prohibited and subject to criminal and civil penalties under Federal 
                Laws including but not limited to Public Laws 83-703 and 99-474.
              </li>
              <li>
                Everything you post on the internet is recorded in some way and can make its way back to you. These privacy 
                rules are in place for your safety and the safety of the network.
              </li>
            </ul>
          </div>
          <br></br>
          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <p className={styles.paragraph}>
              If you have any questions about this Privacy Policy, please contact us through the available channels on our website.
            </p>
          </div>
          <br></br>
          <div className={styles.footer}>
            <p className={styles.timestamp}>
              Last updated: April 16, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
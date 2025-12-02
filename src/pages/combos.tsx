import React from 'react';
import Head from 'next/head';
// Note: We are importing from components, NOT components/src
import DrugInteractionChecker from '../components/DrugInteractionChecker';

export default function CombosPage() {
  return (
    <>
      <Head>
        <title>Interaction Checker | TripSit</title>
        <meta name="description" content="Harm reduction interaction checker." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* The component handles its own dark background/theme */}
      <main>
        <DrugInteractionChecker />
      </main>
    </>
  );
}

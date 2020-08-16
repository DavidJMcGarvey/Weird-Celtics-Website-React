import React from 'react';
import { Redirect } from 'react-router-dom';

// Simple component to redirect after sign out
export default ({ context }) => {
  context.actions.signOut();
  return (
    <Redirect to="/" />
  );
}
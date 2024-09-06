import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorMessage = ({ message }) => {
  return message ? <Alert variant="danger">{message}</Alert> : null;
};

export default ErrorMessage;

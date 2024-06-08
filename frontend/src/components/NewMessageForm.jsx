import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import leoProfanity from 'leo-profanity';
import { useAddMessage } from '../services/messagesApi.js';

const NewMessageForm = ({ channel }) => {
  const { t } = useTranslation();
  const username = useSelector((state) => state.auth.username);
  const inputRef = useRef(null);
  const [
    addMessage,
  ] = useAddMessage();

  const f = useFormik({
    initialValues: { body: '' },
    onSubmit: async ({ body }) => {
      console.log(body);
      const filtered = leoProfanity.clean(body);
      const message = {
        body: filtered,
        channelId: channel.id,
        username,
      };

      addMessage(message);
      f.resetForm();
      f.setSubmitting(false);
      inputRef.current.focus();
    },
    validateOnBlur: false,
  });

  useEffect(() => {
    inputRef.current.focus();
  }, [channel, f.isSubmitting]);

  const isInvalid = !f.dirty || !f.isValid;

  return (
    <Form noValidate onSubmit={f.handleSubmit} className="py-1 border rounded-2">
      <InputGroup hasValidation={isInvalid}>
        <Form.Control
          ref={inputRef}
          onChange={f.handleChange}
          onBlur={f.handleBlur}
          value={f.values.body}
          name="body"
          aria-label={t('chat.newMessage')}
          disabled={f.isSubmitting}
          placeholder="Введите сообщение..."
          className="border-0 p-0 ps-2"
        />
        <Button variant="group-vertical" type="submit" disabled={isInvalid}>
          <ArrowRightSquare size={20} />
          <span className="visually-hidden">{t('chat.send')}</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

export default NewMessageForm;

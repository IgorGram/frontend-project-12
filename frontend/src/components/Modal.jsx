// @ts-check

import React, { useRef, useEffect, useState } from 'react';
import {
  Modal as BootstrapModal,
  Form,
  Button,
} from 'react-bootstrap';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../slices/index.js';
import {
  useAddChannel,
  useUpdateChannel,
  useDeleteChannel,
  useGetChannels,
} from '../services/channelsApi.js';

const getValidationSchema = (channels) => yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('modals.required')
    .min(3, 'modals.min')
    .max(20, 'modals.max')
    .notOneOf(channels, 'modals.uniq'),
});

const AddChannelForm = ({ handleClose }) => {
  const { data: channels } = useGetChannels(undefined);
  const channelNames = channels.map(({ name }) => name);
  const inputRef = useRef(null);
  const [
    addChannel,
    // TODO: доабавить обработку ошибок
    { error, isLoading }, // eslint-disable-line
  ] = useAddChannel();
  // const rollbar = useRollbar();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const f = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: getValidationSchema(channelNames),
    onSubmit: async ({ name }) => {
      const channel = { name };
      getValidationSchema(channelNames).validateSync({ name });
      addChannel(channel);
      handleClose();
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Добавить канал</BootstrapModal.Title>
        <Button
          variant="close"
          type="button"
          onClick={handleClose}
          aria-label="Close"
          data-bs-dismiss="modal"
        />
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group>
            <Form.Control
              className="mb-2"
              disabled={f.isSubmitting}
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.name}
              isInvalid={(f.errors.name && f.touched.name) || !!f.status}
              name="name"
              id="name"
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="visually-hidden" htmlFor="name">Имя канала</label>
            <Form.Control.Feedback type="invalid">
              Ошибка
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                className="me-2"
                variant="secondary"
                type="button"
                onClick={handleClose}
              >
                Отменить
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={f.isSubmitting}
              >
                Отправить
              </Button>
            </div>
          </Form.Group>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

const RemoveChannelForm = ({ handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [
    deleteChannel,
    // TODO: доабавить обработку ошибок
    { error, isLoading }, // eslint-disable-line
  ] = useDeleteChannel();
  const channelId = useSelector((state) => state.ui.modal.extra?.channelId);
  // const rollbar = useRollbar();
  const handleRemove = async () => {
    setLoading(true);
    deleteChannel(channelId);
    // dispatch(actions.setCurrentChannel({ channelId: '1' }));
    handleClose();
  };

  return (
    <>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Удалить канал</BootstrapModal.Title>
        <Button
          variant="close"
          type="button"
          onClick={handleClose}
          aria-label="Close"
          data-bs-dismiss="modal"
        />
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <p className="lead">Уверены?</p>
        <div className="d-flex justify-content-end">
          <Button
            className="me-2"
            variant="secondary"
            type="button"
            onClick={handleClose}
            disabled={loading}
          >
            Отменить
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={handleRemove}
            disabled={loading}
          >
            Удалить
          </Button>
        </div>
      </BootstrapModal.Body>
    </>
  );
};

const RenameChannelForm = ({ handleClose }) => {
  const { data: channels } = useGetChannels(undefined);
  const channelNames = channels.map(({ name }) => name);
  const channelId = useSelector((state) => state.ui.modal.extra?.channelId);
  const channel = channels.find(({ id }) => channelId === id);
  const inputRef = useRef(null);
  const [
    updateChannel,
    // TODO: доабавить обработку ошибок
    { error, isLoading }, // eslint-disable-line
  ] = useUpdateChannel();
  // const rollbar = useRollbar();
  useEffect(() => {
    setTimeout(() => inputRef.current.select());
  }, []);
  const f = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema: getValidationSchema(channelNames),
    onSubmit: async ({ name }) => {
      const data = { name, id: channelId };
      getValidationSchema(channelNames).validateSync({ name });
      updateChannel(data);
      handleClose();
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <BootstrapModal.Header>
        <BootstrapModal.Title>Переименовать канал</BootstrapModal.Title>
        <Button
          variant="close"
          type="button"
          onClick={handleClose}
          aria-label="Close"
          data-bs-dismiss="modal"
        />
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={f.handleSubmit}>
          <Form.Group>
            <Form.Control
              className="mb-2"
              disabled={f.isSubmitting}
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.name}
              isInvalid={(f.errors.name && f.touched.name) || !!f.status}
              name="name"
              id="name"
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="visually-hidden" htmlFor="name">Имя канала</label>
            <Form.Control.Feedback type="invalid">
              Ошибка
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                className="me-2"
                variant="secondary"
                type="button"
                onClick={handleClose}
              >
                Отменить
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={f.isSubmitting}
              >
                Отправить
              </Button>
            </div>
          </Form.Group>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

const mapping = {
  addChannel: AddChannelForm,
  removeChannel: RemoveChannelForm,
  renameChannel: RenameChannelForm,
};

const Modal = () => {
  const dispatch = useDispatch();
  const isOpened = useSelector((state) => state.ui.modal.isOpened);

  const handleClose = () => {
    dispatch(actions.closeModal());
  };
  const modalType = useSelector((state) => state.ui.modal.type);

  const Component = mapping[modalType];

  return (
    <BootstrapModal show={isOpened} onHide={handleClose} centered>
      {Component && <Component handleClose={handleClose} />}
    </BootstrapModal>
  );
};

export default Modal;

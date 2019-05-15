import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import { Auth, MIN_KEY_LENGTH, MAX_KEY_LENGTH } from '../Auth.js';

const CAT_KEY = 'auth_cat_key';
const CONNECT = 'auth_connect';

const INVALID_KEY = 'auth_validation_cat_key';
const INVALID_AUTH = 'auth_invalid';
const COULD_NOT_CONNECT = 'auth_connection_failed';
const CONNECTION_CONFLICT = 'auth_connection_conflict';

const SPINNER = 'spinner';
const FEEDBACK = 'feedback';

const HIDDEN = 'invisible';
const DISABLED = 'disabled';

describe('Auth', () => {
  it('should display a text field and a connect button', () => {
    const { container, getByLabelText, getByText } = render(
      <Auth connectToRobot={jest.fn()} t={key => key} />
    );

    expect(getByLabelText(CAT_KEY)).toBeInTheDocument();
    expect(getByText(CONNECT)).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it(`should initially not disable the input, disable the button, display a spinner,
      or display feedback`, () => {
    const { container, getByLabelText, getByText, getByTestId } = render(
      <Auth connectToRobot={jest.fn()} t={key => key} />
    );

    expect(getByLabelText(CAT_KEY)).not.toBeDisabled();
    expect(getByText(CONNECT)).not.toHaveClass(DISABLED);
    expect(getByTestId(SPINNER)).toHaveClass(HIDDEN);
    expect(getByTestId(FEEDBACK)).toHaveClass(HIDDEN);

    expect(container.firstChild).toMatchSnapshot();
  });

  it(`should disable the button and display invalid key feedback if the key is invalid
      when the button is clicked`, () => {
    const { container, getByLabelText, getByText, getByTestId } = render(
      <Auth connectToRobot={jest.fn()} t={key => key} />
    );

    const button = getByText(CONNECT);
    const input = getByLabelText(CAT_KEY);
    const feedback = getByTestId(FEEDBACK);

    fireEvent.change(input, { target: { value: 'cat_' } });
    fireEvent.click(button);

    expect(button).toHaveClass(DISABLED);
    expect(feedback).not.toHaveClass(HIDDEN);
    expect(feedback).toHaveTextContent(INVALID_KEY);

    expect(container.firstChild).toMatchSnapshot();
  });

  it(`should disable the button and display invalid key feedback whenever the key is invalid
      after the first button click`, () => {
    const { getByLabelText, getByText, getByTestId } = render(
      <Auth connectToRobot={jest.fn()} t={key => key} />
    );

    const button = getByText(CONNECT);
    const input = getByLabelText(CAT_KEY);
    const feedback = getByTestId(FEEDBACK);

    fireEvent.change(input, { target: { value: 'a_' } });

    expect(button).not.toHaveClass(DISABLED);
    expect(feedback).toHaveClass(HIDDEN);

    fireEvent.click(button);

    expect(button).toHaveClass(DISABLED);
    expect(feedback).not.toHaveClass(HIDDEN);
    expect(feedback).toHaveTextContent(INVALID_KEY);

    fireEvent.change(input, { target: { value: 'a'.repeat(MIN_KEY_LENGTH - 1) } });

    expect(button).toHaveClass(DISABLED);
    expect(feedback).not.toHaveClass(HIDDEN);
    expect(feedback).toHaveTextContent(INVALID_KEY);

    fireEvent.change(input, { target: { value: 'a'.repeat(MAX_KEY_LENGTH + 1) } });

    expect(button).toHaveClass(DISABLED);
    expect(feedback).not.toHaveClass(HIDDEN);
    expect(feedback).toHaveTextContent(INVALID_KEY);

    fireEvent.change(input, { target: { value: 'a'.repeat(MAX_KEY_LENGTH) } });

    expect(button).not.toHaveClass(DISABLED);
    expect(feedback).toHaveClass(HIDDEN);
  });

  it('should handle enter key press as a button click', () => {
    const { getByLabelText, getByText, getByTestId } = render(
      <Auth connectToRobot={jest.fn()} t={key => key} />
    );

    const button = getByText(CONNECT);
    const input = getByLabelText(CAT_KEY);
    const feedback = getByTestId(FEEDBACK);

    fireEvent.keyPress(input, { charCode: 13 });

    expect(button).toHaveClass(DISABLED);
    expect(feedback).not.toHaveClass(HIDDEN);
    expect(feedback).toHaveTextContent(INVALID_KEY);
  });

  it(`should display a spinner, disable the button, disable the input, hide feedback,
      and call the 'connectToRobot' prop with the cat key when the button is clicked`, () => {
    const catKey = 'cat';
    const connect = jest.fn();

    const { getByLabelText, getByText, getByTestId } = render(
      <Auth connectToRobot={connect} t={key => key} />
    );

    const button = getByText(CONNECT);
    const input = getByLabelText(CAT_KEY);
    const feedback = getByTestId(FEEDBACK);

    fireEvent.change(input, { target: { value: catKey } });
    fireEvent.click(button);

    expect(input).toBeDisabled(DISABLED);
    expect(button).toHaveClass(DISABLED);
    expect(feedback).toHaveClass(HIDDEN);
    expect(connect).toHaveBeenCalledWith(catKey);
  });

  it(`should hide the spinner, enable the button, enable the input, and display auth failed
      feedback when the auth fails`, () => {
    const { getByLabelText, getByText, getByTestId } = render(
      <Auth authFailed={true} connectToRobot={jest.fn()} t={key => key} />
    );

    const button = getByText(CONNECT);
    const input = getByLabelText(CAT_KEY);
    const feedback = getByTestId(FEEDBACK);
    const spinner = getByTestId(SPINNER);

    expect(spinner).toHaveClass(HIDDEN);
    expect(button).not.toHaveClass(DISABLED);
    expect(input).not.toBeDisabled();

    expect(feedback).not.toHaveClass(HIDDEN);
    expect(feedback).toHaveTextContent(INVALID_AUTH);
  });

  it(`should hide the spinner, enable the button, enable the input, and display connection
      timed out feedback when the auth fails when the connection times out`, () => {
    const { getByLabelText, getByText, getByTestId } = render(
      <Auth connectionTimedOut={true} connectToRobot={jest.fn()} t={key => key} />
    );

    const button = getByText(CONNECT);
    const input = getByLabelText(CAT_KEY);
    const feedback = getByTestId(FEEDBACK);
    const spinner = getByTestId(SPINNER);

    expect(spinner).toHaveClass(HIDDEN);
    expect(button).not.toHaveClass(DISABLED);
    expect(input).not.toBeDisabled();

    expect(feedback).not.toHaveClass(HIDDEN);
    expect(feedback).toHaveTextContent(COULD_NOT_CONNECT);
  });

  it(`should hide the spinner, enable the button, enable the input, and display connection
      conflict feedback when the auth fails when there is a connection conflict`, () => {
    const { getByLabelText, getByText, getByTestId } = render(
      <Auth connectionConflict={true} connectToRobot={jest.fn()} t={key => key} />
    );

    const button = getByText(CONNECT);
    const input = getByLabelText(CAT_KEY);
    const feedback = getByTestId(FEEDBACK);
    const spinner = getByTestId(SPINNER);

    expect(spinner).toHaveClass(HIDDEN);
    expect(button).not.toHaveClass(DISABLED);
    expect(input).not.toBeDisabled();

    expect(feedback).not.toHaveClass(HIDDEN);
    expect(feedback).toHaveTextContent(CONNECTION_CONFLICT);
  });
});

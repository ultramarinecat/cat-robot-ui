import React from 'react';
import { render, fireEvent } from 'react-testing-library';

import { Button } from '../Button.js';

const DISABLED_CLASS = 'disabled';

describe('Button', () => {
  it('should display a button with text', () => {
    const text = 'cat';
    const { container, getByText } = render(<Button text={text} onClick={jest.fn()} />);

    const button = getByText(text);

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(text);
    expect(button).not.toHaveClass(DISABLED_CLASS);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should be disabled if `disabed` is true', () => {
    const text = 'cat';
    const { container, getByText } = render(
      <Button text={text} disabled={true} onClick={jest.fn()} />
    );

    const button = getByText(text);

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(DISABLED_CLASS);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should call callback prop when clicked', () => {
    const text = 'cat';
    const handleClick = jest.fn();

    const { getByText } = render(<Button text={text} onClick={handleClick} />);
    const button = getByText(text);

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});

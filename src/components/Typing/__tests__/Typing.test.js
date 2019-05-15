import React from 'react';
import { render } from 'react-testing-library';

import { Typing } from '../Typing.js';

const TYPING = 'typing';

describe('Typing', () => {
  it('should type `text`', () => {
    const text = 'cat';

    const { container, getByTestId } = render(<Typing text={text} />);
    const typing = getByTestId(TYPING);

    expect(typing).toBeInTheDocument();
    expect(typing).toHaveTextContent(text);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should replace previously typed text', () => {
    const initialText = 'cat';

    const { getByTestId, rerender } = render(<Typing text={initialText} />);
    const typing = getByTestId(TYPING);

    expect(typing).toBeInTheDocument();
    expect(typing).toHaveTextContent(initialText);

    const updatedText = 'dog';
    rerender(<Typing text={updatedText} />);

    expect(typing).not.toHaveTextContent(initialText);
    expect(typing).toHaveTextContent(updatedText);
  });
});

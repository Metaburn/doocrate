import React from 'react';
import { render, shallow } from 'enzyme';
import Icon from './icon';

describe('Icon', () => {
  it('should render an icon', () => {
    const wrapper = shallow(<Icon name="play" />);
    expect(
      wrapper.contains(
        <span className="material-icons notranslate">play</span>,
      ),
    ).toBe(true);
  });
});

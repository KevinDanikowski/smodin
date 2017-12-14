import React from 'react';
import App from '../src/components/App';

describe('App component', () => {
    const wrapper = shallow(<App />);

    it('should have a div wrapper', () => {
        expect(wrapper.type()).to.eql('div');
    });
});
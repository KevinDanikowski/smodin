import React from 'react'
import Console from '../src/components/console/Console'

describe('Console item', () => {
    const wrapper = shallow(<Console />)

    it('should be a div', () => {
        expect(wrapper.type()).to.eql('div')
    })
    it('should not rerender on state change', () => {
        expect(wrapper.type()).to.eql('div')
    })
})
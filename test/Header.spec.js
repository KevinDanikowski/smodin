import React from 'react'
import Header from '../src/components/header/Header'
import {GC_USER_ID} from '../src/constants'
import {MemoryRouter} from 'react-router-dom'
import { Link } from 'react-router-dom'

describe('Header', () => {
    const wrapper = mount(
        <MemoryRouter>
            <Header />
        </MemoryRouter>)
    localStorage.setItem(GC_USER_ID, 'cjajzv0vab2aq01829fi6qcdp')
    it('should have MemoryRouter not be a div', () => {
        expect(wrapper.type()).to.not.eql('div');
    });
    it('renders', () => {
        expect(wrapper).to.have.length(1)
    })
    describe('logged in', () => {
        it('should contain links to console and settings tab', () => {
            expect(wrapper.containsAllMatchingElements([<div>|</div>])).to.equal(true)
            expect(wrapper.find([
                <MemoryRouter>
                    <Link></Link>
                </MemoryRouter>])).to.equal(true)
        })
    })
    localStorage.removeItem(GC_USER_ID)
    describe('not logged in', () => {

    })
})

import React, { Fragment, useContext, useEffect } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import ContactItem from './ContactItem'
import ContactContext from '../../context/contact/contactContext'
import Spinner from '../layout/Spinner'

const Contacts = () => {
    const contactContext = useContext(ContactContext);

    const { contacts, filtered, getContacts, loading } = contactContext;

    useEffect(() => {
        getContacts();
        // to run at the begining
        // eslint-disable-next-line
    }, []);

    if (contacts !== null && !loading && contacts.length === 0) {
        return <h4>Please Add a Contact</h4>
    }

    return (
        <Fragment>
            {contacts !== null && !loading ? (<TransitionGroup>
                {filtered !== null ?
                    filtered.map(contact => (
                        // ._id b/c we get the _ from the id created in mongodb
                        <CSSTransition key={contact._id} timeout={500} classNames='item'>
                            <ContactItem contact={contact} />
                        </CSSTransition>
                    ))
                    : contacts.map(contact =>
                        (
                            <CSSTransition key={contact._id} timeout={500} classNames='item'>
                                <ContactItem contact={contact} />
                            </CSSTransition>
                        )
                    )}
            </TransitionGroup>) : <Spinner/>}
            
        </Fragment>
    )
}

export default Contacts

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style/help.css'; // Ensure you have this CSS file for styling

const Help = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const helpArticles = [
        { title: 'How to Update Creche Information', link: '/help/update-creche-info' },
        { title: 'How to Add a Student', link: '/help/add-student' },
        { title: 'How to Add an Application', link: '/help/add-application' },
        { title: 'How to View and Manage Applications', link: '/help/manage-applications' },
        { title: 'How to Update Student Information', link: '/help/update-student-info' },
        { title: 'How to Set Up Notifications', link: '/help/setup-notifications' },
        { title: 'How to Manage Creche Staff', link: '/help/manage-staff' },
        { title: 'How to View Creche Reports', link: '/help/view-reports' },
        { title: 'How to Reset Your Password', link: '/help/reset-password' },
        { title: 'How to Contact Support', link: '/help/contact-support' },
        { title: 'How to Customize Your Profile', link: '/help/customize-profile' },
        { title: 'How to Access and Use the Dashboard', link: '/help/use-dashboard' },
        { title: 'How to Manage Your Wish List', link: '/help/manage-wishlist' },
        { title: 'How to Log In and Out of the App', link: '/help/login-logout' },
        { title: 'How to Enable Dark Mode', link: '/help/enable-dark-mode' },
        { title: 'How to Update Your Account Settings', link: '/help/update-account-settings' },
        { title: 'How to Add New Creche Locations', link: '/help/add-creche-locations' },
        { title: 'How to Provide Feedback', link: '/help/provide-feedback' },
        { title: 'How to Navigate the App', link: '/help/navigate-app' },
        { title: 'How to Use the Search Feature', link: '/help/use-search-feature' },
        { title: 'How to Manage User Roles and Permissions', link: '/help/manage-roles-permissions' }
    ];

    const faqs = [
        { question: 'What should I do if I forget my password?', answer: 'Use the "Reset Password" feature on the login page to receive a password reset link.' },
        { question: 'How can I update my profile information?', answer: 'Go to your profile settings and update the necessary details.' },
        { question: 'Who can I contact for technical support?', answer: 'You can contact support via the "Contact Support" link in the Help section.' },
        { question: 'How can I add a new creche?', answer: 'Navigate to the "Manage Creche" section and select "Add New Creche" to fill in the details.' }
    ];

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredArticles = helpArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm)
    );

    return (
        <div className="help-container">
            <h1>Help Page</h1>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search help articles..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
            </div>
            <div className="help-cards">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article, index) => (
                        <div key={index} className="help-card">
                            <h2>{article.title}</h2>
                            <Link to={article.link} className="read-more-button">Read More</Link>
                        </div>
                    ))
                ) : (
                    <p>No articles found.</p>
                )}
            </div>
            <div className="faq-section">
                <h2>Frequently Asked Questions</h2>
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <h3>{faq.question}</h3>
                        <p>{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Help;

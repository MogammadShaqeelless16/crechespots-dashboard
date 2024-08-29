import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseOperations/supabaseClient'; // Adjust path as needed
import ReactQuill from 'react-quill'; // Import the WYSIWYG editor
import 'react-quill/dist/quill.snow.css'; // Import styles for the editor
import './style/help.css';

const Help = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [helpArticles, setHelpArticles] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [editorContent, setEditorContent] = useState('');
    const [newArticleTitle, setNewArticleTitle] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        // Fetch help articles from Supabase
        const fetchHelpArticles = async () => {
            const { data, error } = await supabase
                .from('help_articles')
                .select('*');
            if (!error) {
                setHelpArticles(data);
            }
        };

        // Fetch user role from Supabase
        const fetchUserRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('users')
                    .select('roles(role_name)')
                    .eq('id', user.id)
                    .single();
                if (!error) {
                    setUserRole(data.roles.role_name);
                }
            }
        };

        fetchHelpArticles();
        fetchUserRole();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredArticles = helpArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm)
    );

    const handleArticleClick = (article) => {
        setSelectedArticle(article);
        setEditorContent(article.content); // Load content into editor
        setNewArticleTitle(article.title); // Load title into title field
    };

    const handleOverlayClose = () => {
        setSelectedArticle(null);
        setEditorContent(''); // Clear editor content
        setNewArticleTitle(''); // Clear title field
        setShowAddForm(false); // Close the add form if open
    };

    const handleArticleEdit = async () => {
        if (userRole === 'Administrator' || userRole === 'Developer') {
            const { error } = await supabase
                .from('help_articles')
                .update({ title: newArticleTitle, content: editorContent })
                .eq('id', selectedArticle.id);
            if (!error) {
                // Refresh articles after editing
                setHelpArticles(helpArticles.map(article =>
                    article.id === selectedArticle.id ? { ...article, title: newArticleTitle, content: editorContent } : article
                ));
                handleOverlayClose(); // Close overlay after editing
            }
        }
    };

    const handleArticleDelete = async () => {
        if (userRole === 'Administrator' || userRole === 'Developer') {
            const { error } = await supabase
                .from('help_articles')
                .delete()
                .eq('id', selectedArticle.id);
            if (!error) {
                // Refresh articles after deletion
                setHelpArticles(helpArticles.filter(article => article.id !== selectedArticle.id));
                handleOverlayClose(); // Close overlay after deletion
            }
        }
    };

    const handleAddArticle = async () => {
        if (userRole === 'Administrator' || userRole === 'Developer') {
            const { error } = await supabase
                .from('help_articles')
                .insert([{ title: newArticleTitle, content: editorContent }]);
            if (!error) {
                // Refresh articles after adding
                const { data, error: fetchError } = await supabase
                    .from('help_articles')
                    .select('*');
                if (!fetchError) {
                    setHelpArticles(data);
                    setNewArticleTitle('');
                    setEditorContent('');
                    setShowAddForm(false); // Hide the form after adding
                }
            }
        }
    };

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
                {userRole === 'Administrator' || userRole === 'Developer' ? (
                    <button
                        className="add-article-button"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? 'Cancel' : 'Add Article'}
                    </button>
                ) : null}
            </div>
            <div className="help-cards">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                        <div key={article.id} className="help-card">
                            <h2>{article.title}</h2>
                            <button onClick={() => handleArticleClick(article)}>Read More</button>
                        </div>
                    ))
                ) : (
                    <p>No articles found.</p>
                )}
            </div>

            {showAddForm && (
                <div className="overlay">
                    <div className="overlay-content">
                        <h2>Add New Article</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newArticleTitle}
                            onChange={(e) => setNewArticleTitle(e.target.value)}
                        />
                        <ReactQuill
                            value={editorContent}
                            onChange={setEditorContent}
                        />
                        <button onClick={handleAddArticle}>Add Article</button>
                        <button onClick={handleOverlayClose}>Cancel</button>
                    </div>
                </div>
            )}

            {selectedArticle && (
                <div className="overlay">
                    <div className="overlay-content">
                        {userRole === 'Administrator' || userRole === 'Developer' ? (
                            <>
                            <text>Title</text>
                                <input
                                    type="text"
                                    value={newArticleTitle}
                                    onChange={(e) => setNewArticleTitle(e.target.value)}
                                />
                            <text>Content</text>
                                <ReactQuill
                                    value={editorContent}
                                    onChange={setEditorContent}
                                />
                                <button onClick={handleArticleEdit}>Save Changes</button>
                                <button onClick={handleArticleDelete}>Delete</button>
                            </>
                        ) : (
                            <>
                                <h2>{selectedArticle.title}</h2>
                                <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                            </>
                        )}
                        <button onClick={handleOverlayClose}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Help;

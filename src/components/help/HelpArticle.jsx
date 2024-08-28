import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from './supabaseClient';

const HelpArticle = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            const { data, error } = await supabase
                .from('help_articles')
                .select('title, content')
                .eq('id', id)
                .single();
            
            if (error) {
                console.error('Error fetching article:', error);
            } else {
                setArticle(data);
            }
            setLoading(false);
        };
        fetchArticle();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!article) {
        return <div>Article not found.</div>;
    }

    return (
        <div className="help-article-container">
            <h1>{article.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
    );
};

export default HelpArticle;

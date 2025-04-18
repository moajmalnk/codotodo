const API_URL = process.env.REACT_APP_API_URL || 'https://todobackend.moajmalnk.in/api';

export const fetchTodos = async () => {
    try {
        const response = await fetch(`${API_URL}/todos.php`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

export const fetchMeets = async () => {
    try {
        const response = await fetch(`${API_URL}/meets.php`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error fetching meets:', error);
        throw error;
    }
}; 
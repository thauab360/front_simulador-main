export const getSavedForms = async () => {
    try {
      const response = await fetch('/api/savedForms');
      const data = await response.json();
      return data.forms;
    } catch (error) {
      console.error('Erro ao buscar formulários salvos:', error);
      throw error;
    }
  };
  
import api from "./api";

const favoriteService = {

    listar: async () => {
        const response = await api.get("/favoritos");
        return response.data;
    },

    adicionar: async (cursoId) => {
        await api.post(`/favoritos/${cursoId}`);
    },

    remover: async (cursoId) => {
        await api.delete(`/favoritos/${cursoId}`);
    },

    existe: async (cursoId) => {
        const response = await api.get(
            `/favoritos/${cursoId}/existe`
        );

        return response.data;
    }

};

export default favoriteService;
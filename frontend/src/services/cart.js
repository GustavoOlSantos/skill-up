import api from "./api";

const cartService = {

    listar: async () => {
        const response = await api.get("/carrinho");
        return response.data;
    },

    adicionar: async (cursoId) => {
        await api.post(`/carrinho/${cursoId}`);
    },

    remover: async (cursoId) => {
        await api.delete(`/carrinho/${cursoId}`);
    },

    existe: async (cursoId) => {
        const response = await api.get(
            `/carrinho/${cursoId}/existe`
        );

        return response.data;
    },

    limpar: async () => {
        await api.delete("/carrinho");
    }

};

export default cartService;
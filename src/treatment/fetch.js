export async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error("Erro na requisição:", error);

    // Se for um erro de conexão (servidor offline)
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      window.location.href = "/erro-interno"; // Redireciona para a página de erro
    }

    throw error; // Continua propagando o erro
  }
}
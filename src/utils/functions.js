import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ⏱️ 72 horas em milissegundos
const EXPIRATION_MS = 72 * 60 * 60 * 1000;

export function truncateText(text, maxChars) {
  if (!text || text.length <= maxChars) {
    return text; // Retorna o texto original se não exceder o limite
  }
  return text.slice(0, maxChars) + '...'; // Retorna o texto truncado com "..."
}

export function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateStrongPassword(password) {
  // Verifica se a senha tem pelo menos 8 caracteres e pelo menos uma letra maiúscula
  const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
}

export function validateCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

  // Verifica se o CPF tem 11 dígitos ou é uma sequência repetida
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Verifica o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  let rest = (sum * 10) % 11;
  rest = (rest === 10 || rest === 11) ? 0 : rest;

  if (rest !== parseInt(cpf[9])) {
    return false;
  }

  // Verifica o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i);
  }
  rest = (sum * 10) % 11;
  rest = (rest === 10 || rest === 11) ? 0 : rest;

  return rest === parseInt(cpf[10]);
}

export function validateCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
    return false; // Verifica se o CNPJ tem 14 dígitos e se não é uma sequência repetida
  }

  const calcCheckDigit = (cnpj, size) => {
    let sum = 0;
    let pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += parseInt(cnpj[size - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const firstCheckDigit = calcCheckDigit(cnpj, 12);
  const secondCheckDigit = calcCheckDigit(cnpj, 13);

  return firstCheckDigit === parseInt(cnpj[12]) && secondCheckDigit === parseInt(cnpj[13]);
}

export const descriptionStatusCampaign = (status) => {

  switch (status) {
    case 0:
      return 'Ativa';
    case 1:
      return 'Encerrada';
    case 2:
      return 'Aprovada';
    case 3:
      return 'Rejeitada';
    case 4:
      return 'Finalizada';
    case 5:
      return 'Desativada';
    default:
      return ''
  }
}

export const currentDateFormatedDDMMYYYHH = (date) => {
  const currentDate = new Date(date);

  // Extrair dia, mês, ano, hora e minuto
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Mês é baseado em zero
  const year = currentDate.getFullYear();
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  // Formatar a data no formato desejado
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  // Atualizar o estado com a data formatada
  return formattedDate
}

export const formatCurrency = (value) => {
  if (!value) return "0,00"; // Evita erros com valores indefinidos ou nulos
  
  const isNegative = value.includes("-"); // Verifica se o valor tem um sinal de negativo
  const cleanedValue = value.replace(/\D/g, "") || "0";
  let number = parseFloat(cleanedValue) / 100;

  if (isNegative) number *= -1; // Reaplica o sinal negativo, se necessário

  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getTimeElapsed = (donatedAt) => {
  if (!donatedAt) return '';
  return formatDistanceToNow(parseISO(donatedAt), { addSuffix: true, locale: ptBR });
};

export const getTotalDonations = (donations) => {
  let totalInCents = 0;
  let totalSupporters = 0;
  let supporters = [];
  if (Array.isArray(donations)) {

    // Ordenar as doações de forma decrescente pelo campo donatedAt
    donations.sort((a, b) => {
      return new Date(b.donatedAt) - new Date(a.donatedAt);
    });

    donations.forEach(donation => {
      
      if (donation.status === 1) {
        totalInCents += donation.value;
        totalSupporters += 1;
        if (donation.donor) {
          supporters.push(donation.donor);
        }
      }
    });
  }
  return { totalInCents, totalSupporters, supporters };
}

export const getPathFromUrl = (url) => {
  const match = url.match(/^https?:\/\/[^\/]+(\/[^?]+)/);
  return match ? match[1] : null;
}

export const urlIsImage = (url) => {
  const path = getPathFromUrl(url);
  if (!path) return false;
  return url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null
}

export const handleGetFileUrl = async (medias) => {
  const files = await Promise.all(
    medias.map(async (media) => {
      const response = await fetch(`/api/get-file?filekey=${media}`);
      const data = await response.json();
      if (response.ok) {
        return data.fileUrl; // Retorna a URL do arquivo
      }
      return null; // Retorna null caso a resposta não seja OK
    })
  );

  // Filtrar valores nulos (caso existam)
  return files.filter((file) => file !== null);
};

export function centsToDecimal(cents, language = 'pt-BR', currency = 'BRL') {
  if (typeof cents !== 'number' || isNaN(cents)) {
    return 0;
  }

  const decimalF = cents / 100;

  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: currency
  }).format(decimalF);
}

// 📦 localStorage cache com expiração
export const getCachedFileUrl = async (fileKey) => {
  const cacheKey = `image_cache_${fileKey}`;
  const cachedRaw = localStorage.getItem(cacheKey);

  if (cachedRaw) {
    try {
      const cached = JSON.parse(cachedRaw);
      const now = Date.now();

      if (now - cached.timestamp < EXPIRATION_MS) {
        return cached.fileUrl;
      } else {
        localStorage.removeItem(cacheKey); // Expirado
      }
    } catch {
      localStorage.removeItem(cacheKey); // Corrupção
    }
  }

  try {
    const response = await fetch(`/api/get-file?filekey=${fileKey}`);
    const data = await response.json();
    if (response.ok && data?.fileUrl) {
      const cacheValue = {
        fileUrl: data.fileUrl,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheValue));
      return data.fileUrl;
    }
  } catch (err) {
    console.error(`Error fetching fileKey: ${fileKey}`, err);
  }

  return '/assets/images/img_loading.png';
};

export const generateValidCPF = () => {
  const randomDigits = () =>
    Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))

  const calcCheckDigit = (digits, factor) => {
    const total = digits.reduce((sum, num) => sum + num * factor--, 0)
    const rest = (total * 10) % 11
    return rest === 10 ? 0 : rest
  }

  const base = randomDigits()

  const d1 = calcCheckDigit(base, 10)
  const d2 = calcCheckDigit([...base, d1], 11)

  return [...base, d1, d2].join("")
}
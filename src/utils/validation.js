// validation.js
export const regexPatterns = {
    cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    cep: /^\d{5}-\d{3}$/,
    telefone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    numero: /^\d+$/,
    horas: /^\d+$/
};

export const formatCNPJ = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");
    return value.substring(0, 18);
};

export const formatCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value.substring(0, 14);
};

export const formatCEP = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
    return value.substring(0, 9);
};

export const formatTelefone = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d{4,5})(\d{4})$/, "$1-$2");
    return value.substring(0, 15);
};

export const validateStep = (stepNumber, fields) => {
    const errors = {};

    if (stepNumber === 1) {
        if (!fields.razaoSocial.trim()) errors.razaoSocial = "Obrigatório";
        if (!fields.cnpj.trim()) {
            errors.cnpj = "Obrigatório";
        } else if (!regexPatterns.cnpj.test(fields.cnpj)) {
            errors.cnpj = "Obrigatório";
        }
        if (!fields.dataAbertura) errors.dataAbertura = "Obrigatório";
        if (!fields.emailInstitucional.trim()) {
            errors.emailInstitucional = "Obrigatório";
        } else if (!regexPatterns.email.test(fields.emailInstitucional)) {
            errors.emailInstitucional = "Obrigatório";
        }
        if (!fields.telefone.trim()) {
            errors.telefone = "Obrigatório";
        } else if (!regexPatterns.telefone.test(fields.telefone)) {
            errors.telefone = "Obrigatório";
        }
    } else if (stepNumber === 2) {
        if (!fields.cep.trim()) {
            errors.cep = "Obrigatório";
        } else if (!regexPatterns.cep.test(fields.cep)) {
            errors.cep = "Obrigatório";
        }
        if (!fields.rua.trim()) errors.rua = "Obrigatório";
        if (!fields.numero.trim()) {
            errors.numero = "Obrigatório";
        } else if (!regexPatterns.numero.test(fields.numero)) {
            errors.numero = "Obrigatório";
        }
        if (!fields.bairro.trim()) errors.bairro = "Obrigatório";
        if (!fields.cidade.trim()) errors.cidade = "Obrigatório";
        if (!fields.estado.trim()) errors.estado = "Obrigatório";
    } else if (stepNumber === 3) {
        if (!fields.cNomeCompleto.trim()) errors.cNomeCompleto = "Obrigatório";
        if (!fields.cCPF.trim()) {
            errors.cCPF = "Obrigatório";
        } else if (!regexPatterns.cpf.test(fields.cCPF)) {
            errors.cCPF = "Obrigatório";
        }
        if (!fields.cRG.trim()) errors.cRG = "Obrigatório";
        if (!fields.dNascimento) errors.dNascimento = "Obrigatório";
        if (!fields.cEstadoCivil) errors.cEstadoCivil = "Obrigatório";
        if (!fields.dAdmissao) errors.dAdmissao = "Obrigatório";
        if (!fields.iDependentes.toString().trim()) errors.iDependentes = "Obrigatório";
        if (!fields.cTelefone.trim()) {
            errors.cTelefone = "Obrigatório";
        } else if (!regexPatterns.telefone.test(fields.cTelefone)) {
            errors.cTelefone = "Obrigatório";
        }
        if (!fields.cSexo) errors.cSexo = "Obrigatório";
        if (!fields.nCargaHorariaDiaria.toString().trim()) {
            errors.nCargaHorariaDiaria = "Obrigatório";
        } else if (!regexPatterns.horas.test(fields.nCargaHorariaDiaria)) {
            errors.nCargaHorariaDiaria = "Obrigatório";
        }
        if (!fields.cHoraEntrada) errors.cHoraEntrada = "Obrigatório";
    } else if (stepNumber === 4) {
        if (!fields.cEmail.trim()) {
            errors.cEmail = "Obrigatório";
        } else if (!regexPatterns.email.test(fields.cEmail)) {
            errors.cEmail = "Obrigatório";
        }
        if (!fields.password) {
            errors.password = "Obrigatório";
        } else if (fields.password.length < 6) {
            errors.password = "Obrigatório";
        }
        if (!fields.confirmPassword) {
            errors.confirmPassword = "Obrigatório";
        } else if (fields.password !== fields.confirmPassword) {
            errors.confirmPassword = "Obrigatório";
        }
    }

    return errors;
};

// Nova função para validação individual em tempo real
export const validateField = (fieldName, value, stepNumber) => {
    if (!value || !value.toString().trim()) {
        return "Obrigatório";
    }

    switch (fieldName) {
        case 'cnpj':
            return regexPatterns.cnpj.test(value) ? null : "Obrigatório";
        case 'cpf':
        case 'cCPF':
            return regexPatterns.cpf.test(value) ? null : "Obrigatório";
        case 'cep':
            return regexPatterns.cep.test(value) ? null : "Obrigatório";
        case 'telefone':
        case 'cTelefone':
            return regexPatterns.telefone.test(value) ? null : "Obrigatório";
        case 'emailInstitucional':
        case 'cEmail':
            return regexPatterns.email.test(value) ? null : "Obrigatório";
        case 'numero':
            return regexPatterns.numero.test(value) ? null : "Obrigatório";
        case 'nCargaHorariaDiaria':
            return regexPatterns.horas.test(value) ? null : "Obrigatório";
        default:
            return null;
    }
};
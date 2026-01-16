// Converters para transformação de dados
/**
 * Coleção de conversores para transformar dados entre formatos
 */
export class Converters {
  /**
   * Converte string para boolean
   */
  static stringToBoolean(value: string | boolean | null | undefined): boolean {
    if (typeof value === 'boolean') return value;
    if (!value) return false;
    return ['true', '1', 'yes', 'sim', 'verdadeiro'].includes(String(value).toLowerCase());
  }

  /**
   * Converte boolean para string
   */
  static booleanToString(value: boolean): string {
    return value ? 'true' : 'false';
  }

  /**
   * Formata valor monetário
   */
  static formatCurrency(value: number, locale = 'pt-BR'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  /**
   * Remove formatação de valor monetário
   */
  static parseCurrency(value: string): number {
    return parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.'));
  }

  /**
   * Formata CPF
   */
  static formatCpf(cpf: string): string {
    return cpf.replace(/\D/g, '').replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  /**
   * Remove formatação de CPF
   */
  static parseCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  /**
   * Formata CNPJ
   */
  static formatCnpj(cnpj: string): string {
    return cnpj
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  /**
   * Remove formatação de CNPJ
   */
  static parseCnpj(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
  }

  /**
   * Formata telefone
   */
  static formatPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) {
      return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
    if (digits.length === 10) {
      return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }
    return phone;
  }

  /**
   * Remove formatação de telefone
   */
  static parsePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  /**
   * Formata CEP
   */
  static formatCep(cep: string): string {
    return cep.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  /**
   * Remove formatação de CEP
   */
  static parseCep(cep: string): string {
    return cep.replace(/\D/g, '');
  }

  /**
   * Capitaliza primeira letra
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Converte para slug
   */
  static toSlug(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Converte de slug
   */
  static fromSlug(slug: string): string {
    return slug
      .replace(/-/g, ' ')
      .split(' ')
      .map((word) => this.capitalize(word))
      .join(' ');
  }

  /**
   * Formata data para exibição
   */
  static formatDate(date: Date | string, locale = 'pt-BR'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(locale);
  }

  /**
   * Formata data e hora para exibição
   */
  static formatDateTime(date: Date | string, locale = 'pt-BR'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString(locale);
  }

  /**
   * Converte segundos para formato HH:MM:SS
   */
  static secondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hours, minutes, secs].map((v) => String(v).padStart(2, '0')).join(':');
  }

  /**
   * Converte formato HH:MM:SS para segundos
   */
  static timeToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Remove acentos de string
   */
  static removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Trunca string com ellipsis
   */
  static truncate(str: string, length: number): string {
    return str.length > length ? str.substring(0, length) + '...' : str;
  }

  /**
   * Formata número com separador de milhares
   */
  static formatNumber(value: number, locale = 'pt-BR'): string {
    return value.toLocaleString(locale);
  }

  /**
   * Converte array para objeto com chave
   */
  static arrayToMap<T extends { id: string | number }>(
    arr: T[],
    keyProperty: keyof T = 'id' as keyof T
  ): Map<any, T> {
    const map = new Map<any, T>();
    arr.forEach((item) => {
      map.set(item[keyProperty], item);
    });
    return map;
  }

  /**
   * Converte objeto aninhado em flat object (para forms)
   */
  static flattenObject(obj: any, prefix = ''): any {
    const flattened: any = {};

    for (const key in obj) {
      if (objObject.prototype.hasOwnProperty.call(key)) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          Object.assign(flattened, this.flattenObject(value, newKey));
        } else {
          flattened[newKey] = value;
        }
      }
    }

    return flattened;
  }

  /**
   * Converte flat object em objeto aninhado
   */
  static unflattenObject(obj: unknown): any {
    const result: any = {};

    for (const key in obj) {
      if (objObject.prototype.hasOwnProperty.call(key)) {
        const keys = key.split('.');
        let current = result;

        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i];
          if (!current[k]) {
            current[k] = {};
          }
          current = current[k];
        }

        current[keys[keys.length - 1]] = obj[key];
      }
    }

    return result;
  }
}

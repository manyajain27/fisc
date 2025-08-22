import { Investment, Portfolio } from '@/types/portfolio';

export interface CSVRow {
  [key: string]: string;
}

export class PortfolioParser {
  
  static parseCSV(csvContent: string): CSVRow[] {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: CSVRow = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row;
    });
  }

  static parseJSON(jsonContent: string): any[] {
    try {
      const data = JSON.parse(jsonContent);
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }

  static mapToInvestment(row: CSVRow | any, index: number): Investment {
    // Handle both CSV (string keys) and JSON objects
    const getValue = (key: string): string => {
      return row[key] || row[key.toLowerCase()] || row[key.replace(/\s+/g, '_').toLowerCase()] || '';
    };

    const name = getValue('name') || getValue('stock_name') || getValue('investment_name') || `Investment ${index + 1}`;
    const type = this.determineInvestmentType(getValue('type') || getValue('category') || getValue('asset_class'));
    
    // Parse numeric values safely
    const parseNumber = (value: string | number): number => {
      if (typeof value === 'number') return value;
      const num = parseFloat(value.toString().replace(/[^\d.-]/g, ''));
      return isNaN(num) ? 0 : num;
    };

    const parseDate = (value: string): Date => {
      if (!value) return new Date();
      const date = new Date(value);
      return isNaN(date.getTime()) ? new Date() : date;
    };

    const quantity = parseNumber(getValue('quantity') || getValue('units') || getValue('shares') || '1');
    const purchasePrice = parseNumber(getValue('purchase_price') || getValue('buy_price') || getValue('cost_price') || '0');
    const currentPrice = parseNumber(getValue('current_price') || getValue('market_price') || getValue('ltp') || purchasePrice.toString());
    
    return {
      id: `inv_${Date.now()}_${index}`,
      name,
      type,
      category: this.determineCategory(type),
      quantity,
      purchasePrice,
      currentPrice,
      purchaseDate: parseDate(getValue('purchase_date') || getValue('buy_date') || getValue('date')),
      dividendReceived: parseNumber(getValue('dividend') || getValue('dividend_received') || '0') || undefined,
      brokerageFee: parseNumber(getValue('brokerage') || getValue('commission') || '0') || undefined,
      stampDuty: parseNumber(getValue('stamp_duty') || '0') || undefined,
      stt: parseNumber(getValue('stt') || getValue('transaction_tax') || '0') || undefined,
      gst: parseNumber(getValue('gst') || getValue('tax') || '0') || undefined
    };
  }

  static determineInvestmentType(typeString: string): Investment['type'] {
    const type = typeString.toLowerCase().trim();
    
    if (type.includes('equity') || type.includes('stock') || type.includes('share')) {
      return 'equity';
    }
    if (type.includes('mutual') || type.includes('fund') || type.includes('mf')) {
      if (type.includes('elss')) return 'elss';
      return 'mutual_fund';
    }
    if (type.includes('bond') || type.includes('debenture')) {
      return 'bond';
    }
    if (type.includes('real estate') || type.includes('property') || type.includes('reit')) {
      return 'real_estate';
    }
    if (type.includes('crypto') || type.includes('bitcoin') || type.includes('digital')) {
      return 'crypto';
    }
    if (type.includes('ppf')) {
      return 'ppf';
    }
    if (type.includes('nsc')) {
      return 'nsc';
    }
    if (type.includes('fd') || type.includes('fixed deposit')) {
      return 'fd';
    }
    if (type.includes('elss')) {
      return 'elss';
    }
    
    return 'equity'; // Default fallback
  }

  static determineCategory(type: Investment['type']): Investment['category'] {
    switch (type) {
      case 'equity':
      case 'mutual_fund':
        return 'stcg'; // Will be determined by holding period
      case 'bond':
      case 'fd':
        return 'debt';
      case 'elss':
      case 'ppf':
      case 'nsc':
        return 'tax_saving';
      default:
        return 'stcg';
    }
  }

  static validateInvestment(investment: Investment): string[] {
    const errors: string[] = [];
    
    if (!investment.name || investment.name.trim() === '') {
      errors.push('Investment name is required');
    }
    
    if (investment.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }
    
    if (investment.purchasePrice <= 0) {
      errors.push('Purchase price must be greater than 0');
    }
    
    if (investment.currentPrice <= 0) {
      errors.push('Current price must be greater than 0');
    }
    
    if (investment.purchaseDate > new Date()) {
      errors.push('Purchase date cannot be in the future');
    }
    
    return errors;
  }

  static async parseFile(file: File): Promise<Portfolio> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          let rawData: (CSVRow | any)[] = [];
          
          if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
            rawData = this.parseCSV(content);
          } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
            rawData = this.parseJSON(content);
          } else {
            throw new Error('Unsupported file format. Please upload CSV or JSON files.');
          }

          if (rawData.length === 0) {
            throw new Error('No data found in the uploaded file');
          }

          const investments: Investment[] = [];
          const errors: string[] = [];

          rawData.forEach((row, index) => {
            try {
              const investment = this.mapToInvestment(row, index);
              const validationErrors = this.validateInvestment(investment);
              
              if (validationErrors.length > 0) {
                errors.push(`Row ${index + 1}: ${validationErrors.join(', ')}`);
              } else {
                investments.push(investment);
              }
            } catch (error) {
              errors.push(`Row ${index + 1}: Failed to parse data - ${error}`);
            }
          });

          if (investments.length === 0) {
            throw new Error(`No valid investments found. Errors: ${errors.join('; ')}`);
          }

          if (errors.length > 0) {
            console.warn('Some rows had errors:', errors);
          }

          const totalValue = investments.reduce((sum, inv) => 
            sum + (inv.quantity * inv.currentPrice), 0
          );
          
          const totalGains = investments.reduce((sum, inv) => 
            sum + (inv.quantity * (inv.currentPrice - inv.purchasePrice)), 0
          );

          const portfolio: Portfolio = {
            id: `portfolio_${Date.now()}`,
            userId: 'current_user', // This would come from auth context
            name: `Portfolio from ${file.name}`,
            investments,
            totalValue,
            totalGains,
            totalLosses: totalGains < 0 ? Math.abs(totalGains) : 0,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          resolve(portfolio);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }

  static generateSampleCSV(): string {
    const headers = [
      'name',
      'type',
      'quantity',
      'purchase_price',
      'current_price',
      'purchase_date',
      'dividend_received',
      'brokerage'
    ];

    const sampleData = [
      ['Reliance Industries', 'equity', '50', '2400', '2650', '2023-01-15', '25', '10'],
      ['SBI Bluechip Fund', 'mutual_fund', '100', '145', '165', '2022-06-10', '8', '0'],
      ['HDFC Bank', 'equity', '25', '1500', '1680', '2023-03-20', '15', '8'],
      ['Axis Long Term Equity', 'elss', '200', '45', '52', '2023-04-01', '0', '0'],
      ['TCS', 'equity', '10', '3200', '3580', '2022-12-05', '20', '5']
    ];

    return [headers.join(','), ...sampleData.map(row => row.join(','))].join('\n');
  }

  static generateSampleJSON(): string {
    const sampleData = [
      {
        name: 'Reliance Industries',
        type: 'equity',
        quantity: 50,
        purchase_price: 2400,
        current_price: 2650,
        purchase_date: '2023-01-15',
        dividend_received: 25,
        brokerage: 10
      },
      {
        name: 'SBI Bluechip Fund',
        type: 'mutual_fund',
        quantity: 100,
        purchase_price: 145,
        current_price: 165,
        purchase_date: '2022-06-10',
        dividend_received: 8,
        brokerage: 0
      }
    ];

    return JSON.stringify(sampleData, null, 2);
  }
}
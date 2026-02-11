
export interface ShippingOption {
  service: string;
  price: number;
  deadlineDays: number;
}

export const calculateShipping = async (cep: string, products: { weight: number }[]): Promise<ShippingOption[]> => {
  // Simulating an API call to Correios
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!cep || cep.length < 8) {
        resolve([]);
        return;
      }
      const totalWeight = products.reduce((acc, p) => acc + p.weight, 0);
      const basePrice = 15 + totalWeight * 2;

      resolve([
        { service: 'PAC', price: basePrice, deadlineDays: 8 },
        { service: 'SEDEX', price: basePrice * 2.5, deadlineDays: 2 }
      ]);
    }, 800);
  });
};

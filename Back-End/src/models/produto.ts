export interface Produto {
  item: any;
  quantidade: number | undefined;
  id: number;
  nome: string;
  preco: number;
  categoria: "pizza" | "bebida" | "sobremesa";
}

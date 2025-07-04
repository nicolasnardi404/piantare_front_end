import InfiniteMenu from "../components/InfiniteMenu";

const items = [
  {
    image: "/images/dharma7.jpg",
    title: "Agrofloresta",
    description:
      "Implementamos sistemas agroflorestais que imitam a diversidade das florestas naturais. Ao integrar árvores, culturas alimentares e plantas nativas, promovemos solos saudáveis, maior biodiversidade e colheitas resilientes para pequenos agricultores.",
  },
  {
    image: "/images/jardim.JPG",
    title: "Apoio a Agricultores Familiares",
    description:
      "Trabalhamos lado a lado com pequenos produtores, oferecendo capacitação, mudas e suporte técnico. Juntos, fortalecemos a agricultura local e promovemos práticas regenerativas.",
  },
  {
    image: "/images/manjericao.jpg",
    title: "Polinizadores e Abelhas",
    description:
      "Criamos habitats seguros e diversificados para abelhas e outros polinizadores, essenciais para a produção de alimentos e a saúde dos ecossistemas. Incentivamos a polinização natural e a abundância de frutos.",
  },
  {
    image: "/images/mantra3.jpg",
    title: "Alimentação Saudável",
    description:
      "Promovemos a produção e o acesso a alimentos frescos, saudáveis e livres de agrotóxicos. Incentivamos hortas comunitárias e quintais produtivos, fortalecendo a soberania alimentar.",
  },
  {
    image: "/images/mantra25.jpg",
    title: "Recuperação de Áreas",
    description:
      "Transformamos áreas degradadas em espaços produtivos e biodiversos, utilizando técnicas de plantio direto, adubação verde e consórcios agroecológicos.",
  },
  {
    image: "/images/mudinha2.jpg",
    title: "Educação Ambiental",
    description:
      "Realizamos oficinas, mutirões e atividades educativas para compartilhar saberes sobre agroecologia, biodiversidade e práticas sustentáveis com toda a comunidade.",
  },
];

export default function PermaculturePage() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#f5f7fa",
      }}
    >
      <div style={{ height: "100%", position: "relative" }}>
        <InfiniteMenu items={items} />
      </div>
    </div>
  );
}

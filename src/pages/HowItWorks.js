import React from "react";
import { Box, Container, Typography } from "@mui/material";
import AppBarMenu from "../components/AppBarMenu";
import YardIcon from "@mui/icons-material/Yard";
import BusinessIcon from "@mui/icons-material/Business";
import MapIcon from "@mui/icons-material/Map";
import DescriptionIcon from "@mui/icons-material/Description";
import HandshakeIcon from "@mui/icons-material/Handshake";
import SearchIcon from "@mui/icons-material/Search";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ProcessSection from "../components/ProcessSection";
import ScrollTriggeredSection from "../components/ScrollTriggeredSection";

const HowItWorks = () => (
  <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
    <AppBarMenu />
    <Container maxWidth="xl" sx={{ pt: 12 }}>
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          mb: { xs: 6, md: 8 },
          fontSize: { xs: "2rem", md: "2.5rem" },
          position: "relative",
          zIndex: 1,
          "&::after": {
            content: '""',
            display: "block",
            width: { xs: "250px", md: "400px" },
            height: "4px",
            background: "linear-gradient(90deg, #4caf50, #81c784)",
            margin: "20px auto 0",
            borderRadius: "2px",
          },
        }}
      >
        Como Funciona
      </Typography>
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          mb: { xs: 6, md: 8 },
          p: { xs: 2, md: 4 },
          background: "rgba(255,255,255,0.92)",
          borderRadius: 4,
          boxShadow: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "primary.main",
            mb: 2,
            textAlign: "center",
          }}
        >
          Conectando Agricultores e Empresas para Regenerar Florestas e o Clima
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2, textAlign: "center" }}>
          Nossa plataforma une agricultores comprometidos com a restauração
          ecológica e empresas que buscam gerar impacto positivo real. Juntos,
          promovemos a biodiversidade, regeneramos florestas e contribuímos para
          a redução do CO2 atmosférico, criando um ciclo virtuoso de benefícios
          ambientais, sociais e econômicos.
        </Typography>
        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
          Ao mapear áreas de plantio, documentar espécies e monitorar o
          desenvolvimento das plantas, garantimos transparência e dados
          confiáveis para todos os envolvidos. Empresas podem apoiar projetos
          alinhados aos seus valores de sustentabilidade, enquanto agricultores
          recebem reconhecimento, apoio técnico e novas oportunidades de
          financiamento. O resultado é uma rede colaborativa que acelera a
          regeneração dos ecossistemas e fortalece a resiliência climática do
          nosso planeta.
        </Typography>
      </Box>
      <ScrollTriggeredSection>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 6 },
            width: "100%",
          }}
        >
          <ProcessSection>
            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <YardIcon sx={{ fontSize: 32 }} /> Para Agricultores
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {[
                {
                  icon: <MapIcon />,
                  title: "Mapeie Suas Áreas",
                  description:
                    "Cadastre e gerencie seus locais de plantio de forma simples e intuitiva em nosso mapa interativo.",
                },
                {
                  icon: <DescriptionIcon />,
                  title: "Documente Sua Biodiversidade",
                  description:
                    "Registre as espécies plantadas, técnicas utilizadas e o impacto positivo no ecossistema local.",
                },
                {
                  icon: <HandshakeIcon />,
                  title: "Conecte-se",
                  description:
                    "Receba propostas de empresas interessadas em apoiar seus projetos de biodiversidade.",
                },
              ].map((step, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4caf50, #81c784)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                      mb: 2,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography
              color="text.secondary"
              sx={{ mt: 4, fontSize: "1.05rem" }}
            >
              Ao participar, agricultores ampliam sua visibilidade, recebem
              apoio técnico e podem acessar novos recursos financeiros para
              expandir práticas regenerativas. O acompanhamento contínuo e a
              documentação transparente valorizam o trabalho do campo e
              facilitam parcerias duradouras.
            </Typography>
          </ProcessSection>
          <ProcessSection>
            <Typography
              variant="h4"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                mb: 4,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <BusinessIcon sx={{ fontSize: 32 }} /> Para Empresas
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {[
                {
                  icon: <SearchIcon />,
                  title: "Encontre Parceiros",
                  description:
                    "Descubra agricultores próximos à sua região que compartilham dos mesmos valores de sustentabilidade.",
                },
                {
                  icon: <AssessmentIcon />,
                  title: "Avalie Projetos",
                  description:
                    "Analise detalhadamente os projetos de biodiversidade e seu potencial impacto ambiental.",
                },
                {
                  icon: <CheckCircleOutlineIcon />,
                  title: "Faça a Diferença",
                  description:
                    "Estabeleça parcerias duradouras e contribua diretamente para a restauração dos ecossistemas.",
                },
              ].map((step, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #4caf50, #81c784)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
                      mb: 2,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Typography
              color="text.secondary"
              sx={{ mt: 4, fontSize: "1.05rem" }}
            >
              Empresas têm acesso a projetos autênticos, com dados confiáveis e
              monitoramento contínuo, compensação de CO2 e fortalecimento da
              reputação sustentável. O apoio direto a iniciativas locais gera
              impacto mensurável e contribui para um futuro mais verde e
              resiliente.
            </Typography>
          </ProcessSection>
        </Box>
      </ScrollTriggeredSection>
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          mt: { xs: 6, md: 8 },
          p: { xs: 2, md: 4 },
          background: "rgba(255,255,255,0.92)",
          borderRadius: 4,
          boxShadow: 2,
        }}
      >
        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
          Junte-se a essa rede de transformação! Cada conexão entre agricultores
          e empresas é um passo a mais para restaurar florestas, proteger a
          biodiversidade e enfrentar as mudanças climáticas. Sua participação
          faz a diferença.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default HowItWorks;

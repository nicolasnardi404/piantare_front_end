import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Register fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf",
      fontWeight: 400,
      fontStyle: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu52xP.ttf",
      fontWeight: 400,
      fontStyle: "italic",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAw.ttf",
      fontWeight: 700,
      fontStyle: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmSU5vAw.ttf",
      fontWeight: 300,
      fontStyle: "normal",
    },
  ],
});

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: "#2e7d32",
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 15,
    color: "#1b5e20",
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 14,
    color: "#424242",
    marginBottom: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#1b5e20",
    marginBottom: 15,
    fontWeight: 700,
    backgroundColor: "#f1f8e9",
    padding: 10,
    borderRadius: 4,
  },
  analysisText: {
    fontSize: 12,
    lineHeight: 1.8,
    color: "#424242",
    marginBottom: 10,
    textAlign: "justify",
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
    lineHeight: 1.6,
    color: "#424242",
  },
  plantSection: {
    marginBottom: 30,
    borderBottom: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 20,
  },
  plantHeader: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#f1f8e9",
    padding: 10,
    borderRadius: 4,
  },
  plantInfo: {
    flex: 1,
  },
  plantTitle: {
    fontSize: 16,
    color: "#1b5e20",
    fontWeight: 700,
    marginBottom: 5,
  },
  plantSubtitle: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#666",
  },
  plantImage: {
    width: 120,
    height: 120,
    objectFit: "cover",
    borderRadius: 4,
    marginLeft: 15,
  },
  detailsGrid: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailItem: {
    width: "50%",
    marginBottom: 8,
    paddingRight: 10,
  },
  updateSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#fafafa",
    borderRadius: 4,
  },
  updateTitle: {
    fontSize: 12,
    color: "#1b5e20",
    fontWeight: 700,
    marginBottom: 8,
  },
  updateGrid: {
    marginTop: 8,
  },
  updateItem: {
    marginBottom: 10,
    paddingLeft: 10,
    borderLeft: 1,
    borderLeftColor: "#2e7d32",
  },
  table: {
    marginVertical: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderBottomStyle: "solid",
    minHeight: 35,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#f1f8e9",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    fontSize: 11,
    color: "#424242",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#666",
    fontSize: 10,
    borderTop: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
  },
});

const CompanyReport = ({ geoAnalysis, locations, companyStats }) => {
  const today = new Date();

  // Add safety checks for props
  const safeGeoAnalysis = geoAnalysis || {};
  const safeLocations = locations || [];
  const safeCompanyStats = companyStats || {
    totalPlants: 0,
    categoryDistribution: {},
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Impacto Ambiental</Text>
          <Text style={styles.subtitle}>
            Data de geração: {format(today, "dd/MM/yyyy")}
          </Text>
          <Text style={styles.subtitle}>
            Total de plantas registradas: {safeCompanyStats.totalPlants}
          </Text>
        </View>

        {/* Environmental Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análise de Impacto Ambiental</Text>
          {safeGeoAnalysis.data?.analysis && (
            <Text style={styles.analysisText}>
              {safeGeoAnalysis.data.analysis}
            </Text>
          )}
        </View>

        {/* Plant Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distribuição por Categoria</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Categoria</Text>
              <Text style={styles.tableCell}>Quantidade</Text>
              <Text style={styles.tableCell}>Porcentagem</Text>
            </View>
            {Object.entries(safeCompanyStats.categoryDistribution || {}).map(
              ([category, count]) => (
                <View key={category} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {formatPlantCategory(category)}
                  </Text>
                  <Text style={styles.tableCell}>{count}</Text>
                  <Text style={styles.tableCell}>
                    {((count / safeCompanyStats.totalPlants) * 100).toFixed(1)}%
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* Plant Inventory */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventário de Plantas</Text>
          {safeLocations.map((plant) => (
            <View key={plant?.id || Math.random()} style={styles.plantSection}>
              <View style={styles.plantHeader}>
                <View style={styles.plantInfo}>
                  <Text style={styles.plantTitle}>
                    {plant?.plant?.nomePopular || "Nome não disponível"}
                  </Text>
                  <Text style={styles.plantSubtitle}>
                    {plant?.plant?.nomeCientifico ||
                      "Nome científico não disponível"}
                  </Text>
                </View>
                {plant?.updates?.length > 0 &&
                plant.updates[plant.updates.length - 1]?.imageUrl ? (
                  <Image
                    src={plant.updates[plant.updates.length - 1].imageUrl}
                    style={styles.plantImage}
                  />
                ) : plant?.imageUrl ? (
                  <Image src={plant.imageUrl} style={styles.plantImage} />
                ) : null}
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.text}>
                    <Text style={{ fontWeight: 700 }}>Categoria: </Text>
                    {formatPlantCategory(plant?.plant?.category) ||
                      "Não especificada"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.text}>
                    <Text style={{ fontWeight: 700 }}>Localização: </Text>
                    {plant?.location?.address || "Endereço não disponível"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.text}>
                    <Text style={{ fontWeight: 700 }}>Altura: </Text>
                    {plant?.plant?.height
                      ? `${plant.plant.height} metros`
                      : "Não especificada"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.text}>
                    <Text style={{ fontWeight: 700 }}>Origem: </Text>
                    {plant?.plant?.origin || "Não especificada"}
                  </Text>
                </View>
                {plant?.plant?.specifications && (
                  <View style={styles.detailItem}>
                    <Text style={styles.text}>
                      <Text style={{ fontWeight: 700 }}>Especificações: </Text>
                      {plant.plant.specifications}
                    </Text>
                  </View>
                )}
                {plant?.plant?.description && (
                  <View style={styles.detailItem}>
                    <Text style={styles.text}>
                      <Text style={{ fontWeight: 700 }}>Descrição: </Text>
                      {plant.plant.description}
                    </Text>
                  </View>
                )}
              </View>

              {plant?.updates?.length > 0 && (
                <View style={styles.updateSection}>
                  <Text style={styles.updateTitle}>
                    Histórico de Atualizações
                  </Text>
                  <View style={styles.updateGrid}>
                    {plant.updates.map((update, index) => (
                      <View key={index} style={styles.updateItem}>
                        <Text style={styles.text}>
                          <Text style={{ fontWeight: 700 }}>
                            {format(
                              new Date(update?.date || today),
                              "dd/MM/yyyy"
                            )}
                          </Text>
                        </Text>
                        <Text style={styles.text}>
                          <Text style={{ fontWeight: 700 }}>Estado: </Text>
                          {update?.health || "Não especificado"}
                        </Text>
                        {update?.notes && (
                          <Text style={styles.text}>
                            <Text style={{ fontWeight: 700 }}>
                              Observações:{" "}
                            </Text>
                            {update.notes}
                          </Text>
                        )}
                        {update?.imageUrl && (
                          <Image
                            src={update.imageUrl}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: "cover",
                              borderRadius: 4,
                              marginTop: 8,
                            }}
                          />
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Relatório gerado em {format(today, "dd/MM/yyyy 'às' HH:mm")}
        </Text>
      </Page>
    </Document>
  );
};

// Helper function to format plant categories
const formatPlantCategory = (category) => {
  const categoryMap = {
    ARVORES: "Árvores",
    ARVORES_FRUTIFERAS: "Árvores Frutíferas",
    CAPINS: "Capins",
    FOLHAGENS_ALTAS: "Folhagens Altas",
    ARBUSTOS: "Arbustos",
    TREPADEIRAS: "Trepadeiras",
    AROMATICAS_E_COMESTIVEIS: "Aromáticas e Comestíveis",
    PLANTAS_DE_FORRACAO: "Plantas de Forração",
    PLANTAS_AQUATICAS_OU_PALUSTRES: "Plantas Aquáticas ou Palustres",
  };

  return categoryMap[category] || category;
};

export default CompanyReport;

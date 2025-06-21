import React, { useEffect, useState } from "react";
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
import axios from "axios";

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
    marginRight: 15,
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
    marginBottom: 8,
  },
  plantDescription: {
    fontSize: 11,
    color: "#424242",
    lineHeight: 1.4,
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
  plantingDay: {
    marginBottom: 15,
    paddingLeft: 10,
    borderLeft: 2,
    borderLeftColor: "#1b5e20",
    backgroundColor: "#f1f8e9",
    padding: 10,
    borderRadius: 4,
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
  farmerSection: {
    marginBottom: 30,
  },
  farmerTitle: {
    fontSize: 18,
    color: "#1b5e20",
    marginBottom: 15,
    fontWeight: 700,
    backgroundColor: "#f1f8e9",
    padding: 10,
    borderRadius: 4,
  },
  farmerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  farmerCard: {
    width: "45%",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  farmerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  farmerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    objectFit: "cover",
  },
  farmerInfo: {
    flex: 1,
  },
  farmerName: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1b5e20",
  },
  farmerEmail: {
    fontSize: 11,
    color: "#666666",
    marginTop: 2,
  },
  farmerStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    backgroundColor: "#f1f8e9",
    padding: 8,
    borderRadius: 4,
  },
  farmerStatItem: {
    flex: 1,
  },
  farmerStatLabel: {
    fontSize: 10,
    color: "#666666",
  },
  farmerStatValue: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1b5e20",
  },
  growthSection: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f1f8e9",
    borderRadius: 4,
    borderLeft: 2,
    borderLeftColor: "#558b2f",
  },
  growthTitle: {
    fontSize: 12,
    color: "#33691e",
    fontWeight: 700,
    marginBottom: 10,
  },
  measurementTimeline: {
    marginTop: 10,
  },
  timelinePoint: {
    marginBottom: 8,
    paddingLeft: 12,
    borderLeft: 1,
    borderLeftColor: "#7cb342",
  },
});

const CompanyReport = ({ geoAnalysis, locations, companyStats }) => {
  const today = new Date();
  const [locationDetails, setLocationDetails] = useState({});

  // Function to get city name from coordinates
  useEffect(() => {
    const fetchCityNames = async () => {
      const details = {};
      for (const plant of locations) {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${plant.latitude}&lon=${plant.longitude}&zoom=10`
          );

          const address = response.data.address;
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            "Cidade não identificada";
          const state = address.state || "Estado não identificado";
          const country = address.country || "País não identificado";

          details[plant.id] = {
            city,
            state,
            country,
          };
        } catch (error) {
          console.error("Error fetching location details:", error);
          details[plant.id] = {
            city: "Cidade não identificada",
            state: "Estado não identificado",
            country: "País não identificado",
          };
        }
      }
      setLocationDetails(details);
    };

    fetchCityNames();
  }, [locations]);

  // Log all incoming data
  console.log("PDF Generation Data:", {
    geoAnalysis: JSON.stringify(geoAnalysis, null, 2),
    locations: JSON.stringify(locations, null, 2),
    companyStats: JSON.stringify(companyStats, null, 2),
    locationDetails: JSON.stringify(locationDetails, null, 2),
    timestamp: format(today, "dd/MM/yyyy 'às' HH:mm"),
  });

  // Add safety checks for props
  const safeGeoAnalysis = geoAnalysis || {};
  const safeLocations = locations || [];
  const safeCompanyStats = companyStats || {
    totalPlants: 0,
    categoryDistribution: {},
  };

  // Process farmers data
  const getFarmersData = () => {
    const farmersMap = new Map();

    locations.forEach((location) => {
      if (location.addedBy && !farmersMap.has(location.addedBy.id)) {
        const farmerPlants = locations.filter(
          (l) => l.addedBy.id === location.addedBy.id
        );
        const plantCategories = new Set(
          farmerPlants.map((p) => p.plant.categoria)
        );

        farmersMap.set(location.addedBy.id, {
          id: location.addedBy.id,
          name: location.addedBy.name,
          email: location.addedBy.email,
          imageUrl: location.addedBy.imageUrl,
          bio: location.addedBy.bio,
          totalPlants: farmerPlants.length,
          categories: plantCategories.size,
          lastPlantingDate: new Date(
            Math.max(
              ...farmerPlants.map((p) => new Date(p.plantedAt || p.createdAt))
            )
          ),
        });
        console.log(farmersMap);
      }
    });

    return Array.from(farmersMap.values());
  };

  const farmers = getFarmersData();

  const formatMeasurements = (measurements) => {
    if (!measurements) return "Não informado";
    const height = measurements.height || "0";
    const width = measurements.width || "0";
    return `${height}m x ${width}m`;
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

        {/* Partner Farmers Section */}
        <View style={styles.farmerSection}>
          <Text style={styles.farmerTitle}>Fazendas Parceiras</Text>
          <View style={styles.farmerGrid}>
            {farmers.map((farmer) => (
              <View key={farmer.id} style={styles.farmerCard}>
                <View style={styles.farmerHeader}>
                  {farmer.imageUrl ? (
                    <Image src={farmer.imageUrl} style={styles.farmerImage} />
                  ) : (
                    <View
                      style={[
                        styles.farmerImage,
                        { backgroundColor: "#e0e0e0" },
                      ]}
                    />
                  )}
                  <View style={styles.farmerInfo}>
                    <Text style={styles.farmerName}>{farmer.name}</Text>
                    <Text style={styles.farmerEmail}>{farmer.email}</Text>
                  </View>
                </View>
                {farmer.bio && <Text style={styles.text}>{farmer.bio}</Text>}
                <View style={styles.farmerStats}>
                  <View style={styles.farmerStatItem}>
                    <Text style={styles.farmerStatLabel}>Total de Plantas</Text>
                    <Text style={styles.farmerStatValue}>
                      {farmer.totalPlants}
                    </Text>
                  </View>
                  <View style={styles.farmerStatItem}>
                    <Text style={styles.farmerStatLabel}>Categorias</Text>
                    <Text style={styles.farmerStatValue}>
                      {farmer.categories}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.text, { marginTop: 8, fontSize: 10 }]}>
                  Último plantio:{" "}
                  {format(farmer.lastPlantingDate, "dd/MM/yyyy")}
                </Text>
              </View>
            ))}
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
                  {plant?.plant?.description && (
                    <Text style={styles.plantDescription}>
                      {plant.plant.description}
                    </Text>
                  )}
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
                    {formatPlantCategory(plant?.plant?.categoria) ||
                      "Não especificada"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.text}>
                    <Text style={{ fontWeight: 700 }}>Localização: </Text>
                    {plant?.latitude?.toFixed(6)},{" "}
                    {plant?.longitude?.toFixed(6)}
                    {locationDetails[plant?.id] && (
                      <Text style={{ fontStyle: "italic" }}>
                        {"\n"}
                        {locationDetails[plant.id].city},{" "}
                        {locationDetails[plant.id].state},{" "}
                        {locationDetails[plant.id].country}
                      </Text>
                    )}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.text}>
                    <Text style={{ fontWeight: 700 }}>Altura: </Text>
                    {plant?.plant?.altura || "Não especificada"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.text}>
                    <Text style={{ fontWeight: 700 }}>Origem: </Text>
                    {plant?.plant?.origem || "Não especificada"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.text}>
                    <Text style={{ fontWeight: 700 }}>Agricultor: </Text>
                    {plant?.addedBy?.name || "Não especificado"}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.text}>
                    <Text style={{ fontWeight: 700 }}>Email: </Text>
                    {plant?.addedBy?.email || "Não especificado"}
                  </Text>
                </View>
                {plant?.plant?.especificacao && (
                  <View style={styles.detailItem}>
                    <Text style={styles.text}>
                      <Text style={{ fontWeight: 700 }}>Especificações: </Text>
                      {plant.plant.especificacao}
                    </Text>
                  </View>
                )}
                {plant?.description && (
                  <View style={styles.detailItem}>
                    <Text style={styles.text}>
                      <Text style={{ fontWeight: 700 }}>
                        Descrição do plantio:{" "}
                      </Text>
                      {plant.description}
                    </Text>
                  </View>
                )}
              </View>

              {(plant?.updates?.length > 0 || plant?.imageUrl) && (
                <View style={styles.updateSection}>
                  <Text style={styles.updateTitle}>
                    Histórico de Atualizações
                  </Text>
                  <View style={styles.updateGrid}>
                    {/* Initial planting entry */}
                    <View style={styles.plantingDay}>
                      <Text style={styles.text}>
                        <Text style={{ fontWeight: 700, color: "#1b5e20" }}>
                          Dia do Plantio:{" "}
                          {format(
                            new Date(plant?.plantedAt || plant?.createdAt),
                            "dd/MM/yyyy"
                          )}
                        </Text>
                      </Text>
                      {plant?.description && (
                        <Text style={styles.text}>
                          <Text style={{ fontWeight: 700 }}>
                            Descrição inicial:{" "}
                          </Text>
                          {plant.description}
                        </Text>
                      )}
                      {plant?.imageUrl && (
                        <Image
                          src={plant.imageUrl}
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
                    {/* Regular updates */}
                    {[...plant.updates]
                      .sort(
                        (a, b) =>
                          new Date(b.updateDate) - new Date(a.updateDate)
                      )
                      .map((update, index) => (
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
                          <Text style={styles.text}>
                            <Text style={{ fontWeight: 700 }}>Medições: </Text>
                            {formatMeasurements(update.measurements)}
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

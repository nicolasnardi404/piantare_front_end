import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #4caf50, #81c784)",
    borderRadius: "4px 4px 0 0",
  },
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  margin: "0 auto",
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  cursor: "pointer",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
  backgroundColor: "rgba(76, 175, 80, 0.04)",
  "&:hover": {
    backgroundColor: "rgba(76, 175, 80, 0.08)",
  },
}));

const Profile = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    bio: "",
    imageUrl: user?.imageUrl || "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageUpload, setImageUpload] = useState({
    file: null,
    preview: null,
    uploading: false,
  });

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile((prev) => ({
          ...prev,
          ...response.data,
        }));
        setLoading(false);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.response?.data?.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUpload({
          file,
          preview: reader.result,
          uploading: false,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageUpload.file) return;

    setImageUpload((prev) => ({ ...prev, uploading: true }));
    const formData = new FormData();
    formData.append("file", imageUpload.file);

    try {
      const response = await axios.post(`${API_URL}/uploads/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update profile with new image URL immediately
      const imageUrl = response.data.url;
      await axios.put(
        `${API_URL}/users/profile`,
        { imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile((prev) => ({ ...prev, imageUrl }));
      setImageUpload({
        file: null,
        preview: null,
        uploading: false,
      });
      setSuccess("Image uploaded successfully");
    } catch (err) {
      console.error("Image upload error:", err);
      setError(err.response?.data?.message || "Failed to upload image");
      setImageUpload((prev) => ({ ...prev, uploading: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put(
        `${API_URL}/users/profile`,
        {
          name: profile.name,
          bio: profile.bio,
          imageUrl: profile.imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(response.data);
      setSuccess("Profile updated successfully");
      setSaving(false);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          Please log in to view your profile
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 600,
          textAlign: "center",
          background: "linear-gradient(135deg, #2e7d32, #81c784)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Meu Perfil
      </Typography>

      <ProfilePaper elevation={3}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid
              item
              xs={12}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <input
                type="file"
                accept="image/*"
                id="profile-image-upload"
                style={{ display: "none" }}
                onChange={handleImageSelect}
              />
              <label htmlFor="profile-image-upload">
                <LargeAvatar
                  src={imageUpload.preview || profile.imageUrl}
                  alt={profile.name}
                />
              </label>
              {imageUpload.file && (
                <UploadButton
                  variant="outlined"
                  color="primary"
                  onClick={handleImageUpload}
                  disabled={imageUpload.uploading}
                  startIcon={<CloudUploadIcon />}
                >
                  {imageUpload.uploading ? "Uploading..." : "Upload New Photo"}
                </UploadButton>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Bio"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                multiline
                rows={4}
                variant="outlined"
                helperText="Conte um pouco sobre você e seu trabalho com plantas"
              />
            </Grid>

            <Grid item xs={12}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={saving}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </ProfilePaper>
    </Container>
  );
};

export default Profile;

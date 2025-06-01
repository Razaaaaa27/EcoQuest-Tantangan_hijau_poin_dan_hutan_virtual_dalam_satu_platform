// src/components/challenges/ChallengeSubmissionModal.vue
<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="submission-modal" @click.stop>
      <div class="modal-header">
        <h3>Kirim Bukti Challenge</h3>
        <button @click="closeModal" class="modal-close">×</button>
      </div>

      <div class="modal-body">
        <div class="challenge-info">
          <h4>{{ challenge.title }}</h4>
          <p class="challenge-description">{{ challenge.description }}</p>
          <div class="challenge-requirements">
            <h5>Persyaratan:</h5>
            <ul>
              <li v-for="requirement in challenge.requirements" :key="requirement">
                {{ requirement }}
              </li>
            </ul>
          </div>
        </div>

        <form @submit.prevent="submitEvidence" class="submission-form">
          <!-- Submission Text -->
          <div class="form-group">
            <label for="submissionText">Deskripsi Pengerjaan *</label>
            <textarea
              id="submissionText"
              v-model="form.submissionText"
              rows="4"
              placeholder="Ceritakan bagaimana Anda mengerjakan challenge ini..."
              required
              :class="{ 'error': errors.submissionText }"
            ></textarea>
            <div v-if="errors.submissionText" class="error-message">
              {{ errors.submissionText }}
            </div>
            <div class="char-count">
              {{ form.submissionText.length }}/500
            </div>
          </div>

          <!-- Image Upload -->
          <div class="form-group">
            <label for="images">Foto Bukti * (Maksimal 5 foto)</label>
            <div class="upload-area" :class="{ 'dragover': isDragOver }" 
                 @drop="handleDrop" 
                 @dragover.prevent="isDragOver = true"
                 @dragleave.prevent="isDragOver = false">
              <input
                type="file"
                id="images"
                ref="fileInput"
                @change="handleFileSelect"
                accept="image/*"
                multiple
                hidden
              />
              
              <div v-if="selectedImages.length === 0" class="upload-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                <p>Klik atau drag & drop foto bukti di sini</p>
                <span>Format: JPG, PNG, WebP (Maks. 10MB per foto)</span>
              </div>

              <div v-else class="image-preview-grid">
                <div v-for="(image, index) in selectedImages" :key="index" class="image-preview">
                  <img :src="image.preview" :alt="`Preview ${index + 1}`" />
                  <button type="button" @click="removeImage(index)" class="remove-image">×</button>
                  <div class="image-info">
                    <span class="image-name">{{ image.file.name }}</span>
                    <span class="image-size">{{ formatFileSize(image.file.size) }}</span>
                  </div>
                </div>
              </div>

              <button type="button" @click="$refs.fileInput.click()" class="upload-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                {{ selectedImages.length === 0 ? 'Pilih Foto' : 'Tambah Foto' }}
              </button>
            </div>
            <div v-if="errors.images" class="error-message">
              {{ errors.images }}
            </div>
          </div>

          <!-- Location (Optional) -->
          <div class="form-group">
            <label for="location">Lokasi (Opsional)</label>
            <div class="location-input">
              <input
                type="text"
                id="location"
                v-model="form.locationText"
                placeholder="Masukkan alamat atau lokasi..."
              />
              <button type="button" @click="getCurrentLocation" class="location-btn" :disabled="gettingLocation">
                <svg v-if="!gettingLocation" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z" />
                </svg>
                <div v-else class="loading-spinner"></div>
                {{ gettingLocation ? 'Getting...' : 'Use Current' }}
              </button>
            </div>
          </div>

          <!-- Terms Agreement -->
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.agreeTerms" required />
              <span class="checkmark"></span>
              Saya menyatakan bahwa foto dan informasi yang saya kirim adalah benar dan sesuai dengan challenge yang dikerjakan
            </label>
          </div>

          <!-- Submit Button -->
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary" :disabled="isSubmitting">
              Batal
            </button>
            <button type="submit" class="btn btn-primary" :disabled="!canSubmit || isSubmitting">
              <svg v-if="isSubmitting" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4V2A10,10 0 0,1 22,12H20A8,8 0 0,0 12,4Z" />
              </svg>
              {{ isSubmitting ? 'Mengirim...' : 'Kirim Bukti' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChallengeSubmissionModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    challenge: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        submissionText: '',
        locationText: '',
        location: null,
        agreeTerms: false
      },
      selectedImages: [],
      errors: {},
      isDragOver: false,
      gettingLocation: false,
      isSubmitting: false
    }
  },
  computed: {
    canSubmit() {
      return (
        this.form.submissionText.length >= 10 &&
        this.selectedImages.length > 0 &&
        this.form.agreeTerms &&
        !this.isSubmitting
      )
    }
  },
  methods: {
    closeModal() {
      if (!this.isSubmitting) {
        this.resetForm()
        this.$emit('close')
      }
    },

    resetForm() {
      this.form = {
        submissionText: '',
        locationText: '',
        location: null,
        agreeTerms: false
      }
      this.selectedImages = []
      this.errors = {}
      this.isDragOver = false
      this.gettingLocation = false
      this.isSubmitting = false
    },

    handleFileSelect(event) {
      const files = Array.from(event.target.files)
      this.processFiles(files)
    },

    handleDrop(event) {
      event.preventDefault()
      this.isDragOver = false
      
      const files = Array.from(event.dataTransfer.files)
      this.processFiles(files)
    },

    processFiles(files) {
      this.errors.images = ''
      
      // Filter only image files
      const imageFiles = files.filter(file => file.type.startsWith('image/'))
      
      if (imageFiles.length === 0) {
        this.errors.images = 'Hanya file gambar yang diizinkan'
        return
      }

      // Check total count
      if (this.selectedImages.length + imageFiles.length > 5) {
        this.errors.images = 'Maksimal 5 foto'
        return
      }

      // Process each file
      imageFiles.forEach(file => {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          this.errors.images = `File ${file.name} terlalu besar (maks. 10MB)`
          return
        }

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          this.selectedImages.push({
            file: file,
            preview: e.target.result
          })
        }
        reader.readAsDataURL(file)
      })
    },

    removeImage(index) {
      this.selectedImages.splice(index, 1)
      this.errors.images = ''
    },

    async getCurrentLocation() {
      if (!navigator.geolocation) {
        alert('Geolocation tidak didukung oleh browser ini')
        return
      }

      this.gettingLocation = true
      
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          })
        })

        this.form.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }

        // Try to get address from coordinates (optional)
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=id`
          )
          const data = await response.json()
          this.form.locationText = data.display_name || `${position.coords.latitude}, ${position.coords.longitude}`
        } catch (e) {
          this.form.locationText = `${position.coords.latitude}, ${position.coords.longitude}`
        }

      } catch (error) {
        console.error('Error getting location:', error)
        alert('Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin lokasi diberikan.')
      } finally {
        this.gettingLocation = false
      }
    },

    validateForm() {
      this.errors = {}
      
      if (this.form.submissionText.length < 10) {
        this.errors.submissionText = 'Deskripsi minimal 10 karakter'
      }
      
      if (this.form.submissionText.length > 500) {
        this.errors.submissionText = 'Deskripsi maksimal 500 karakter'
      }
      
      if (this.selectedImages.length === 0) {
        this.errors.images = 'Minimal 1 foto bukti harus diunggah'
      }
      
      return Object.keys(this.errors).length === 0
    },

   // Update the submitEvidence method in ChallengeSubmissionModal.vue
async submitEvidence() {
  if (!this.validateForm()) {
    return
  }

  this.isSubmitting = true

  try {
    // Prepare form data
    const formData = new FormData()
    
    // FIXED: Use the correct field name that backend expects
    formData.append('challengeId', this.challenge._id)
    formData.append('submissionText', this.form.submissionText)
    
    // Add location data if exists
    if (this.form.location) {
      formData.append('location', JSON.stringify({
        ...this.form.location,
        address: this.form.locationText
      }))
    } else if (this.form.locationText) {
      formData.append('location', JSON.stringify({
        address: this.form.locationText
      }))
    }
    
    // Add images - FIXED: Use 'images' as field name (not 'submissionImages')
    this.selectedImages.forEach((imageObj, index) => {
      formData.append('images', imageObj.file)
    })

    console.log('📤 Submitting form data:', {
      challengeId: this.challenge._id,
      submissionTextLength: this.form.submissionText.length,
      imageCount: this.selectedImages.length,
      hasLocation: !!this.form.location || !!this.form.locationText
    })

    // Submit to API using the correct API endpoint
    const response = await this.$api.post('/submissions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('✅ Submission successful:', response.data)

    // Show success message
    this.$notify({
      type: 'success',
      title: 'Berhasil!',
      message: 'Bukti challenge berhasil dikirim dan sedang dalam review'
    })

    this.closeModal()
    
    // Emit success event to parent component
    this.$emit('submitted', response.data.data.submission)
    
  } catch (error) {
    console.error('❌ Submission error:', error)
    
    let errorMessage = 'Gagal mengirim bukti challenge'
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.status === 400) {
      errorMessage = 'Data yang dikirim tidak valid'
    } else if (error.response?.status === 401) {
      errorMessage = 'Sesi telah berakhir, silakan login ulang'
    } else if (error.response?.status === 413) {
      errorMessage = 'File terlalu besar, maksimal 10MB per foto'
    } else if (error.response?.status === 500) {
      errorMessage = 'Terjadi kesalahan server, coba lagi nanti'
    }
    
    this.$notify({
      type: 'error',
      title: 'Error!',
      message: errorMessage
    })
  } finally {
    this.isSubmitting = false
  }
}
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.submission-modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
}

.challenge-info {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.challenge-info h4 {
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-weight: 600;
}

.challenge-description {
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.challenge-requirements h5 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
}

.challenge-requirements ul {
  margin: 0;
  padding-left: 1.25rem;
  color: #6b7280;
}

.challenge-requirements li {
  margin: 0.25rem 0;
}

.submission-form {
  space-y: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group textarea,
.form-group input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group textarea:focus,
.form-group input[type="text"]:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-group textarea.error,
.form-group input.error {
  border-color: #ef4444;
}

.char-count {
  text-align: right;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s;
  position: relative;
}

.upload-area.dragover {
  border-color: #10b981;
  background: #f0fdf4;
}

.upload-placeholder {
  color: #6b7280;
}

.upload-placeholder svg {
  margin: 0 auto 1rem;
  color: #9ca3af;
}

.upload-placeholder p {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.upload-placeholder span {
  font-size: 0.875rem;
}

.upload-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  transition: background 0.2s;
}

.upload-btn:hover {
  background: #059669;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.image-preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
}

.image-preview img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.image-info {
  padding: 0.5rem;
  font-size: 0.75rem;
}

.image-name {
  display: block;
  color: #374151;
  font-weight: 500;
  margin-bottom: 0.25rem;
  word-break: break-all;
}

.image-size {
  color: #6b7280;
}

.location-input {
  display: flex;
  gap: 0.5rem;
}

.location-input input {
  flex: 1;
}

.location-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  transition: background 0.2s;
}

.location-btn:hover:not(:disabled) {
  background: #4b5563;
}

.location-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  line-height: 1.5;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

.checkmark {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #059669;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .submission-modal {
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body {
    padding: 1rem;
  }
  
  .image-preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .location-input {
    flex-direction: column;
  }
}
</style>
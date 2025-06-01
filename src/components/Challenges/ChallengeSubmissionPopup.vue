<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="submission-modal" @click.stop>
      <div class="modal-header">
        <h3>Selesaikan Tantangan</h3>
        <button @click="$emit('close')" class="modal-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="challenge-info">
          <h4>{{ challenge.title }}</h4>
          <p>{{ challenge.description }}</p>
        </div>

        <form @submit.prevent="submitChallenge" class="submission-form">
          <div class="form-group">
            <label for="submission-text">
              Ceritakan pengalaman Anda menyelesaikan tantangan ini *
            </label>
            <textarea
              id="submission-text"
              v-model="submissionForm.text"
              placeholder="Jelaskan apa yang telah Anda lakukan untuk menyelesaikan tantangan ini..."
              rows="4"
              required
              :maxlength="500"
            ></textarea>
            <div class="char-count">{{ submissionForm.text.length }}/500</div>
          </div>

          <div class="form-group">
            <label for="submission-images">
              Upload Foto Bukti *
            </label>
            <div class="file-upload-area" @click="$refs.fileInput.click()">
              <div v-if="!selectedImages.length" class="upload-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                <p>Klik untuk upload foto bukti</p>
                <span>JPG, PNG, atau WEBP (Max 5MB per file)</span>
              </div>
              
              <div v-else class="image-preview-grid">
                <div v-for="(image, index) in selectedImages" :key="index" class="image-preview">
                  <img :src="image.preview" :alt="`Preview ${index + 1}`" />
                  <button type="button" @click.stop="removeImage(index)" class="remove-image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                    </svg>
                  </button>
                </div>
                <div v-if="selectedImages.length < 3" class="add-more" @click="$refs.fileInput.click()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              multiple
              @change="handleImageUpload"
              style="display: none"
            />
            <div class="upload-info">
              Minimal 1 foto, maksimal 3 foto. Pastikan foto menunjukkan bukti nyata bahwa Anda telah menyelesaikan tantangan.
            </div>
          </div>

          <div class="form-group" v-if="challenge.category === 'plantation' || challenge.category === 'conservation'">
            <label>Lokasi (Opsional)</label>
            <div class="location-input">
              <input
                type="text"
                v-model="submissionForm.location.address"
                placeholder="Masukkan alamat atau nama tempat"
              />
              <button type="button" @click="getCurrentLocation" class="location-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
                </svg>
                Lokasi Saya
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="$emit('close')" class="btn btn-secondary">
              Batal
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="!isFormValid || isSubmitting"
            >
              <svg v-if="isSubmitting" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4V2A10,10 0 0,1 22,12H20A8,8 0 0,0 12,4Z" />
              </svg>
              <span v-if="!isSubmitting">Kirim Submission</span>
              <span v-else>Mengirim...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChallengeSubmissionPopup',
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
      isSubmitting: false,
      selectedImages: [],
      submissionForm: {
        text: '',
        location: {
          address: '',
          latitude: null,
          longitude: null
        }
      }
    }
  },
  computed: {
    challengeId() {
      return this.challenge._id || this.challenge.id;
    },
    isFormValid() {
      return this.submissionForm.text.trim().length >= 10 && this.selectedImages.length > 0;
    }
  },
  methods: {
    resetForm() {
      this.submissionForm = {
        text: '',
        location: {
          address: '',
          latitude: null,
          longitude: null
        }
      };
      this.selectedImages = [];
    },
    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      
      files.forEach(file => {
        if (this.selectedImages.length >= 3) return;
        
        // Validate file
        if (!file.type.startsWith('image/')) {
          this.$store.dispatch('addNotification', {
            type: 'error',
            message: 'File harus berupa gambar',
            timeout: 3000
          });
          return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB
          this.$store.dispatch('addNotification', {
            type: 'error',
            message: 'Ukuran file tidak boleh lebih dari 5MB',
            timeout: 3000
          });
          return;
        }
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImages.push({
            file: file,
            preview: e.target.result,
            name: file.name
          });
        };
        reader.readAsDataURL(file);
      });
      
      // Reset input
      event.target.value = '';
    },
    removeImage(index) {
      this.selectedImages.splice(index, 1);
    },
    async getCurrentLocation() {
      if (!navigator.geolocation) {
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: 'Geolokasi tidak didukung browser Anda',
          timeout: 3000
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          this.submissionForm.location.latitude = position.coords.latitude;
          this.submissionForm.location.longitude = position.coords.longitude;
          
          // Optional: Get address from coordinates using reverse geocoding
          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=YOUR_API_KEY`
            );
            const data = await response.json();
            if (data.results && data.results[0]) {
              this.submissionForm.location.address = data.results[0].formatted;
            }
          } catch (error) {
            console.log('Could not get address from coordinates');
          }
        },
        (error) => {
          this.$store.dispatch('addNotification', {
            type: 'error',
            message: 'Tidak dapat mengakses lokasi Anda',
            timeout: 3000
          });
        }
      );
    },
    async submitChallenge() {
      if (!this.isFormValid) return;
      
      this.isSubmitting = true;
      
      try {
        // Prepare form data
        const formData = new FormData();
        formData.append('submissionText', this.submissionForm.text);
        formData.append('location', JSON.stringify(this.submissionForm.location));
        
        // Add images
        this.selectedImages.forEach((image, index) => {
          formData.append('images', image.file);
        });
        
        console.log('🎯 ChallengeSubmissionPopup: Submitting challenge completion:', {
          challengeId: this.challengeId,
          textLength: this.submissionForm.text.length,
          imageCount: this.selectedImages.length
        });
        
        await this.$emit('complete', this.challengeId, formData);
        
        this.$emit('close');
        this.resetForm();
        
      } catch (error) {
        console.error('❌ ChallengeSubmissionPopup: Error submitting challenge:', error);
      } finally {
        this.isSubmitting = false;
      }
    }
  },
  watch: {
    show(newVal) {
      if (!newVal) {
        this.resetForm();
        document.body.style.overflow = '';
      } else {
        document.body.style.overflow = 'hidden';
      }
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
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
}

.challenge-info {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.challenge-info h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.challenge-info p {
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

.submission-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-group textarea,
.form-group input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-group textarea:focus,
.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.char-count {
  text-align: right;
  font-size: 0.75rem;
  color: #6b7280;
}

.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-upload-area:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
}

.upload-placeholder svg {
  color: #9ca3af;
}

.upload-placeholder p {
  font-weight: 600;
  margin: 0;
}

.upload-placeholder span {
  font-size: 0.75rem;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.image-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.remove-image:hover {
  background: rgba(0, 0, 0, 0.9);
}

.add-more {
  aspect-ratio: 1;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}

.add-more:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.upload-info {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.location-input {
  display: flex;
  gap: 0.5rem;
}

.location-input input {
  flex: 1;
}

.location-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  transition: all 0.2s ease;
}

.location-btn:hover {
  background: #e5e7eb;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.form-actions .btn {
  flex: 1;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive Design */
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
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .location-input {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .file-upload-area {
    padding: 1.5rem 1rem;
  }
  
  .upload-placeholder p {
    font-size: 0.875rem;
  }
}
</style>
<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="submission-modal" @click.stop>
      <div class="modal-header">
        <h3>Kirim Penyelesaian Tantangan</h3>
        <button @click="closeModal" class="modal-close">×</button>
      </div>
      
      <div class="modal-body">
        <div class="challenge-info">
          <h4>{{ challenge.title }}</h4>
          <p class="challenge-points">{{ challenge.points }} Poin</p>
        </div>

        <form @submit.prevent="submitChallenge">
          <div class="form-group">
            <label for="title">Judul Submission *</label>
            <input
              id="title"
              type="text"
              v-model="form.title"
              placeholder="Masukkan judul untuk submission Anda"
              maxlength="100"
              required
            />
            <small class="char-count">{{ form.title.length }}/100</small>
          </div>

          <div class="form-group">
            <label for="description">Deskripsi *</label>
            <textarea
              id="description"
              v-model="form.description"
              placeholder="Jelaskan bagaimana Anda menyelesaikan tantangan ini..."
              rows="4"
              maxlength="1000"
              required
            ></textarea>
            <small class="char-count">{{ form.description.length }}/1000</small>
          </div>

          <div class="form-group">
            <label for="images">Upload Foto Bukti</label>
            <div class="file-upload-area" @click="triggerFileInput">
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                @change="handleFileSelect"
                style="display: none"
              />
              <div class="upload-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                <p>Klik untuk upload foto atau drag and drop</p>
                <small>Maksimal 5 foto, masing-masing 5MB</small>
              </div>
            </div>
            
            <!-- Preview uploaded images -->
            <div v-if="selectedFiles.length > 0" class="image-previews">
              <div v-for="(file, index) in selectedFiles" :key="index" class="image-preview">
                <img :src="file.preview" :alt="file.name" />
                <button type="button" @click="removeFile(index)" class="remove-image">×</button>
                <span class="file-name">{{ file.name }}</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.agreedToTerms" required />
              <span class="checkmark"></span>
              Saya konfirmasi bahwa submission ini asli dan mengikuti persyaratan tantangan
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">Batal</button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="!canSubmit || isSubmitting"
            >
              <span v-if="isSubmitting">Mengirim...</span>
              <span v-else>Kirim Tantangan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SubmissionModal',
  props: {
    challenge: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        title: '',
        description: '',
        agreedToTerms: false
      },
      selectedFiles: [],
      isSubmitting: false
    }
  },
  computed: {
    canSubmit() {
      return this.form.title.trim() && 
             this.form.description.trim() && 
             this.form.agreedToTerms &&
             !this.isSubmitting
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    
    // PERBAIKAN: Gunakan Promise untuk handle file processing
    handleFileSelect(event) {
      const files = Array.from(event.target.files)
      
      // Validate file count
      if (this.selectedFiles.length + files.length > 5) {
        this.$store.dispatch('addNotification', {
          type: 'warning',
          message: 'Maksimal 5 foto diperbolehkan',
          timeout: 3000
        })
        return
      }
      
      // Process files with Promise.all untuk menunggu semua selesai
      const filePromises = files.map(file => {
        return new Promise((resolve, reject) => {
          // Validate file size
          if (file.size > 5 * 1024 * 1024) {
            this.$store.dispatch('addNotification', {
              type: 'warning',
              message: `File ${file.name} terlalu besar. Maksimal 5MB per file.`,
              timeout: 5000
            })
            resolve(null) // Skip this file
            return
          }
          
          // Validate file type
          if (!file.type.startsWith('image/')) {
            this.$store.dispatch('addNotification', {
              type: 'warning',
              message: `File ${file.name} bukan gambar`,
              timeout: 3000
            })
            resolve(null) // Skip this file
            return
          }
          
          // Create preview
          const reader = new FileReader()
          reader.onload = (e) => {
            resolve({
              file,
              name: file.name,
              preview: e.target.result
            })
          }
          reader.onerror = () => reject(new Error(`Gagal membaca ${file.name}`))
          reader.readAsDataURL(file)
        })
      })
      
      // Wait for all files to be processed
      Promise.all(filePromises)
        .then(results => {
          results.filter(result => result !== null).forEach(fileObj => {
            this.selectedFiles.push(fileObj)
          })
        })
        .catch(error => {
          console.error('File processing error:', error)
          this.$store.dispatch('addNotification', {
            type: 'error',
            message: 'Error memproses beberapa file',
            timeout: 3000
          })
        })
      
      // Clear input
      event.target.value = ''
    },
    
    removeFile(index) {
      this.selectedFiles.splice(index, 1)
    },
    
    async submitChallenge() {
      if (!this.canSubmit) return
      
      this.isSubmitting = true
      
      try {
        // PERBAIKAN: Validasi challenge data
        if (!this.challenge || !this.challenge._id) {
          throw new Error('Data tantangan tidak valid')
        }
        
        const formData = new FormData()
        formData.append('challengeId', this.challenge._id)
        formData.append('title', this.form.title.trim())
        formData.append('submissionText', this.form.description.trim())  // ✅ Field yang benar
        formData.append('description', this.form.description.trim())  // ✅ Backup untuk compatibility
        
        // Add images
        this.selectedFiles.forEach(fileObj => {
          formData.append('images', fileObj.file)
        })
        
        // TAMBAHAN: Debug FormData content
        console.log('🔍 FormData Debug:')
        console.log('Challenge ID:', this.challenge._id)
        console.log('Title:', this.form.title.trim())
        console.log('Text/Description:', this.form.description.trim())
        console.log('Files count:', this.selectedFiles.length)
        
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}:`, `[File] ${value.name} (${value.size} bytes)`)
          } else {
            console.log(`${key}:`, value)
          }
        }
        
        const response = await this.$store.dispatch('submissions/createSubmission', formData)
        
        this.$store.dispatch('addNotification', {
          type: 'success',
          message: 'Submission berhasil dikirim! Mohon tunggu review dari admin.',
          timeout: 5000
        })
        
        this.$emit('submitted', response.data.submission)
        this.closeModal()
        
      } catch (error) {
        console.error('❌ Submit Challenge Error:', error)
        this.$store.dispatch('addNotification', {
          type: 'error',
          message: error.message || 'Gagal mengirim tantangan',
          timeout: 5000
        })
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
/* Remove modal-overlay styles since it's not a popup */

.submission-modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #e5e7eb;
}

/* Remove modal slide animation */

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #fafafa;
  border-radius: 16px 16px 0 0;
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
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.challenge-info {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  text-align: center;
}

.challenge-info h4 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.challenge-points {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
  resize: vertical;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.char-count {
  display: block;
  text-align: right;
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 4px;
}

.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafafa;
}

.file-upload-area:hover {
  border-color: #10b981;
  background: #f0fdfa;
}

.upload-content svg {
  color: #9ca3af;
  margin-bottom: 12px;
}

.upload-content p {
  margin: 0 0 4px 0;
  color: #374151;
  font-weight: 500;
}

.upload-content small {
  color: #6b7280;
  font-size: 0.8rem;
}

.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.image-preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}

.image-preview img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  display: block;
}

.remove-image {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.remove-image:hover {
  background: rgba(0, 0, 0, 0.9);
}

.file-name {
  display: block;
  padding: 8px;
  font-size: 0.75rem;
  color: #6b7280;
  background: white;
  border-top: 1px solid #e5e7eb;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.5;
}

.checkbox-label input[type="checkbox"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox-label input[type="checkbox"]:checked {
  background: #10b981;
  border-color: #10b981;
}

.checkbox-label input[type="checkbox"]:checked::after {
  content: "✓";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
  }
  
  .submission-modal {
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body {
    padding: 20px 16px;
  }
  
  .challenge-info {
    padding: 16px;
  }
  
  .image-previews {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .modal-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .file-upload-area {
    padding: 24px 16px;
  }
  
  .upload-content svg {
    width: 36px;
    height: 36px;
  }
  
  .modal-header h3 {
    font-size: 1.1rem;
  }
}
</style>
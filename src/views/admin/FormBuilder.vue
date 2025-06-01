<template>
  <form @submit.prevent="handleSubmit" class="form-builder">
    <div v-for="field in fields" :key="field.name" class="form-group" :class="field.containerClass">
      <label v-if="field.label" :for="field.name" class="form-label">
        {{ field.label }}
        <span v-if="field.required" class="required">*</span>
      </label>

      <!-- Text Input -->
      <input v-if="field.type === 'text' || field.type === 'email' || field.type === 'url' || field.type === 'password'"
             :id="field.name"
             :type="field.type"
             :name="field.name"
             :placeholder="field.placeholder"
             :required="field.required"
             :disabled="field.disabled"
             :readonly="field.readonly"
             :minlength="field.minlength"
             :maxlength="field.maxlength"
             :class="['form-control', field.inputClass, { 'error': errors[field.name] }]"
             v-model="formData[field.name]" />

      <!-- Number Input -->
      <input v-else-if="field.type === 'number'"
             :id="field.name"
             type="number"
             :name="field.name"
             :placeholder="field.placeholder"
             :required="field.required"
             :disabled="field.disabled"
             :readonly="field.readonly"
             :min="field.min"
             :max="field.max"
             :step="field.step"
             :class="['form-control', field.inputClass, { 'error': errors[field.name] }]"
             v-model.number="formData[field.name]" />

      <!-- Textarea -->
      <textarea v-else-if="field.type === 'textarea'"
                :id="field.name"
                :name="field.name"
                :placeholder="field.placeholder"
                :required="field.required"
                :disabled="field.disabled"
                :readonly="field.readonly"
                :rows="field.rows || 4"
                :minlength="field.minlength"
                :maxlength="field.maxlength"
                :class="['form-control', field.inputClass, { 'error': errors[field.name] }]"
                v-model="formData[field.name]"></textarea>

      <!-- Select -->
      <select v-else-if="field.type === 'select'"
              :id="field.name"
              :name="field.name"
              :required="field.required"
              :disabled="field.disabled"
              :class="['form-control', field.inputClass, { 'error': errors[field.name] }]"
              v-model="formData[field.name]">
        <option value="" v-if="field.placeholder">{{ field.placeholder }}</option>
        <option v-for="option in field.options" 
                :key="option.value" 
                :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Multi-select -->
      <select v-else-if="field.type === 'multiselect'"
              :id="field.name"
              :name="field.name"
              :required="field.required"
              :disabled="field.disabled"
              :class="['form-control', field.inputClass, { 'error': errors[field.name] }]"
              v-model="formData[field.name]"
              multiple>
        <option v-for="option in field.options" 
                :key="option.value" 
                :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Checkbox -->
      <div v-else-if="field.type === 'checkbox'" class="checkbox-group">
        <label class="checkbox-label">
          <input type="checkbox"
                 :id="field.name"
                 :name="field.name"
                 :disabled="field.disabled"
                 :class="[field.inputClass, { 'error': errors[field.name] }]"
                 v-model="formData[field.name]" />
          <span class="checkbox-text">{{ field.checkboxLabel || field.label }}</span>
        </label>
      </div>

      <!-- Radio Group -->
      <div v-else-if="field.type === 'radio'" class="radio-group">
        <label v-for="option in field.options" :key="option.value" class="radio-label">
          <input type="radio"
                 :name="field.name"
                 :value="option.value"
                 :disabled="field.disabled"
                 :class="[field.inputClass, { 'error': errors[field.name] }]"
                 v-model="formData[field.name]" />
          <span class="radio-text">{{ option.label }}</span>
        </label>
      </div>

      <!-- File Input -->
      <input v-else-if="field.type === 'file'"
             :id="field.name"
             type="file"
             :name="field.name"
             :required="field.required"
             :disabled="field.disabled"
             :accept="field.accept"
             :multiple="field.multiple"
             :class="['form-control', field.inputClass, { 'error': errors[field.name] }]"
             @change="handleFileChange(field.name, $event)" />

      <!-- Array Input (for requirements, tags, etc.) -->
      <div v-else-if="field.type === 'array'" class="array-input">
        <div v-for="(item, index) in formData[field.name]" :key="index" class="array-item">
          <input type="text" 
                 :placeholder="field.itemPlaceholder || 'Enter item'"
                 v-model="formData[field.name][index]"
                 :class="['form-control', field.inputClass]" />
          <button type="button" @click="removeArrayItem(field.name, index)" class="btn-remove">×</button>
        </div>
        <button type="button" @click="addArrayItem(field.name)" class="btn-add">
          + Add {{ field.itemLabel || 'Item' }}
        </button>
      </div>

      <!-- Object Input (for nested objects like author) -->
      <div v-else-if="field.type === 'object'" class="object-input">
        <div v-for="subField in field.fields" :key="subField.name" class="sub-field">
          <label :for="`${field.name}.${subField.name}`" class="sub-field-label">
            {{ subField.label }}
          </label>
          <input :type="subField.type || 'text'"
                 :id="`${field.name}.${subField.name}`"
                 :placeholder="subField.placeholder"
                 :required="subField.required"
                 :class="['form-control', subField.inputClass]"
                 v-model="formData[field.name][subField.name]" />
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errors[field.name]" class="error-message">
        {{ errors[field.name] }}
      </div>

      <!-- Help Text -->
      <div v-if="field.help" class="help-text">
        {{ field.help }}
      </div>
    </div>

    <div class="form-actions" v-if="showActions">
      <button type="button" @click="$emit('cancel')" class="btn btn-secondary" v-if="showCancel">
        {{ cancelText }}
      </button>
      <button type="submit" :disabled="loading" class="btn btn-primary">
        <span v-if="loading" class="loading-spinner"></span>
        {{ loading ? loadingText : submitText }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'FormBuilder',
  props: {
    fields: { type: Array, required: true },
    modelValue: { type: Object, default: () => ({}) },
    errors: { type: Object, default: () => ({}) },
    loading: { type: Boolean, default: false },
    showActions: { type: Boolean, default: true },
    showCancel: { type: Boolean, default: true },
    submitText: { type: String, default: 'Save' },
    cancelText: { type: String, default: 'Cancel' },
    loadingText: { type: String, default: 'Saving...' }
  },
  emits: ['update:modelValue', 'submit', 'cancel'],
  data() {
    return {
      formData: {}
    }
  },
  created() {
    this.initializeFormData()
  },
  methods: {
    initializeFormData() {
      this.formData = { ...this.modelValue }
      
      // Initialize array and object fields
      this.fields.forEach(field => {
        if (field.type === 'array' && !this.formData[field.name]) {
          this.formData[field.name] = ['']
        } else if (field.type === 'object' && !this.formData[field.name]) {
          this.formData[field.name] = {}
          field.fields?.forEach(subField => {
            this.formData[field.name][subField.name] = ''
          })
        } else if (field.type === 'multiselect' && !this.formData[field.name]) {
          this.formData[field.name] = []
        }
      })
    },
    
    handleSubmit() {
      this.$emit('submit', this.formData)
    },
    
    handleFileChange(fieldName, event) {
      const files = event.target.files
      this.formData[fieldName] = files.length === 1 ? files[0] : Array.from(files)
      this.updateModel()
    },
    
    addArrayItem(fieldName) {
      this.formData[fieldName].push('')
      this.updateModel()
    },
    
    removeArrayItem(fieldName, index) {
      this.formData[fieldName].splice(index, 1)
      this.updateModel()
    },
    
    updateModel() {
      this.$emit('update:modelValue', this.formData)
    }
  },
  
  watch: {
    formData: {
      handler() {
        this.updateModel()
      },
      deep: true
    },
    
    modelValue: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(this.formData)) {
          this.formData = { ...newVal }
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
/* FormBuilder Styles */
.form-builder {
  max-width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-control.error {
  border-color: #ef4444;
}

.checkbox-group,
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label,
.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.array-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.array-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.array-item .form-control {
  flex: 1;
}

.btn-remove {
  width: 32px;
  height: 32px;
  border: none;
  background: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
}

.btn-add {
  padding: 0.5rem 1rem;
  border: 1px dashed #d1d5db;
  background: none;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.object-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.sub-field-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.help-text {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #059669;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* DataTable Styles */
.data-table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.selected-count {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.btn-bulk {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-bulk.delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-bulk.edit {
  background: #dbeafe;
  color: #2563eb;
}

.table-search input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  width: 250px;
}

.data-table {
  overflow-x: auto;
}

.table-header {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  display: grid;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  min-width: max-content;
}

.table-header .table-row {
  font-weight: 600;
  color: #374151;
}

.table-body .table-row {
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s ease;
}

.table-body .table-row:hover {
  background: #f9fafb;
}

.table-body .table-row:last-child {
  border-bottom: none;
}

.table-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-action.edit {
  background: #dbeafe;
  color: #2563eb;
}

.btn-action.delete {
  background: #fee2e2;
  color: #dc2626;
}

.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-page {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

/* Modal Styles */
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
  padding: 2rem;
}

.modal {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal.small { width: 400px; }
.modal.medium { width: 600px; }
.modal.large { width: 800px; }
.modal.full-screen { 
  width: calc(100vw - 4rem); 
  height: calc(100vh - 4rem); 
  max-height: none;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  color: #6b7280;
}

.modal-body {
  padding: 1.5rem;
  flex: 1;
}

.modal-body.scrollable {
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
}

/* Stats Card */
.stats-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  display: block;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

/* Responsive */
@media (max-width: 768px) {
  .modal {
    width: calc(100vw - 2rem);
    margin: 1rem;
  }
  
  .table-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .stats-card {
    flex-direction: column;
    text-align: center;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
}

</style>
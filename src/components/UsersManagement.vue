<template>
  <v-container class="fluid">
    <div class="mt-10 d-flex justify-space-between align-items-center">

      <h2>مدیریت کاربران</h2>
      <v-btn color="secondary" prepend-icon="mdi-plus" rounded="md" @click="onShowDialog">افزودن کاربر</v-btn>
    </div>

    <div class="mt-10">
      <v-text-field
        v-model="searchQuery"
        label="جستجوی براساس نام کاربر..."
      />
    </div>

    <div class="mt-5">
      <v-data-table-virtual
        density="compact"
        :headers="headers"
        item-key="id"
        :items="users"
        :loading="loading"
      >
        <template #item.actions="{item}">
          <v-btn color="primary" variant="plain" @click="mapAddress(item)">
            مشاهده آدرس
          </v-btn>
        </template>
      </v-data-table-virtual>
    </div>

    <v-dialog v-model="showDialog" max-width="500">
      <v-card
        max-width="400"
        :title="`${Object.keys(selectedUser).length > 0 ? `نمایش آدرس ${selectedUser.name} ${selectedUser.username}` : 'ایجاد کاربر جدید'}`"
      >

        <v-card-text>
          <div v-if="Object.keys(selectedUser).length > 0">
            <l-map
              :center="[selectedUser.address.geo.lat, selectedUser.address.geo.lng]"
              style="height: 400px; width: 100%"
              :zoom="10"
            >
              <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </l-map>
          </div>
          <div v-else-if=" showDialog && !selectedUser.id">
            <Form :coords="coords" @dialog-action="showDialog = false" />
          </div>
        </v-card-text>
        <template v-if="Object.keys(selectedUser).length" #actions>
          <v-btn
            class="ms-auto"
            text="بستن"
            @click="closeDialog"
          />
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
// Components
  import Form from './Form.vue'
  // Utilities
  import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
  // Store
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/stores/app'
  // Types
  import type { Users } from '@/stores/types'

  // Define and Init
  const store = useAppStore()
  const { users, loading, headers, searchQuery, selectedUser } = storeToRefs(store)
  const showDialog = ref(false)
  const mapAddress = (user:Users) => {
    selectedUser.value = { ...user }
    showDialog.value = !user.showMap
  }
  const latitude = ref(null)
  const longitude = ref(null)
  const coords = ref([35.6892, 51.3890])

  // modal function when open modal use user navigation to set geo location
  const onShowDialog = () => {
    showDialog.value = !showDialog.value
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          latitude.value = position.coords.latitude
          longitude.value = position.coords.longitude
          coords.value = [latitude.value, longitude.value]
        },
        error => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              showDialog.value = false
              break
          }
        }
      )
    }
  }

  const closeDialog = () => {
    showDialog.value = false
    store.clearSelectedUser()
  }

  watch(
    () => showDialog.value,
    (value:boolean) => {
      if (!value) {
        store.clearSelectedUser()
        store.clear()
      }
    }

  )
</script>

<style scoped>
:deep(.v-table__wrapper){
  direction: initial;
}
</style>

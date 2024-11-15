// Vue
import { onMounted, reactive, ref, watch } from 'vue'
// Utilities
import axios from 'axios'
import { defineStore } from 'pinia'
import { useVuelidate } from '@vuelidate/core'
import { email, maxLength, maxValue, minValue, required } from '@vuelidate/validators'
// Types
import type { UserForm, Users } from './types'

// Define and Functions
export const useAppStore = defineStore('app', () => {
  // Initialization
  const loading = ref(false)
  const users = ref([] as Users[])
  const selectedUser = ref({} as Users)
  const searchQuery = ref(localStorage.getItem('searchQuery') || '')
  const userForm = ref({} as UserForm)

  // define rules of Validator
  const rules = {
    name: { required },
    username: { required },
    email: { required, email },
    phone: { required, maxLength: 11, minValue: 0 },
  }
  const v$ = useVuelidate(rules, userForm.value)

  // Define Header of Table
  const headers = ref([
    {
      title: 'نام',
      align: 'start',
      sortable: true,
      key: 'name',
    },
    {
      title: 'نام خانوادگی',
      align: 'start',
      sortable: false,
      key: 'username',
    },
    {
      title: 'ایمیل',
      align: 'start',
      sortable: false,
      key: 'email',
    },
    {
      title: 'شماره تماس',
      align: 'start',
      sortable: false,
      key: 'phone',
    },
    {
      title: 'نمایش نقشه',
      align: 'center',
      sortable: false,
      key: 'actions',
    },
  ])

  // use Local Storage for list of user
  // Fetch all users from server api
  const fetchUsers = async () => {
    try {
      loading.value = true
      const localStorageUsers = JSON.parse(localStorage.getItem('allUsers') as string)
      if (localStorageUsers && localStorageUsers.length) return users.value = localStorageUsers
      else {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users')
        if (response.status !== 200) throw new Error('Something went wrong...please try again after a while')
        users.value = response.data
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const filteredUsers = computed(() => {
    return users.value.filter(user =>
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  // auto filler for search input
  const searchAutoComplete = (query:string) => {
    if (searchQuery.value.length > 3) {
      const closestMatch = users.value.filter(user => user.name.toLowerCase().startsWith(query.toLowerCase()))
        .sort((a, b) => a.name.length - b.name.length)[0]
      localStorage.setItem('searchQuery', query)
      if (closestMatch) searchQuery.value = closestMatch.name
    }
  }
  onMounted(() => {
    fetchUsers()
  })

  // add user function and use validator for best approach
  const submitForm = async () => {
    v$.value.$validate()
    return v$.value.$pending === false && v$.value.$error === false
  }

  // cancel button of user form
  const clear = () => {
    v$.value.$reset()
  }

  // we have an object for selecting user from table ,when admin click show map at the user list, selected user get full
  const clearSelectedUser = () => {
    selectedUser.value = {} as Users
    userForm.value = {} as UserForm
  }

  // use for handle and trigger autofill function
  watch(
    () => searchQuery.value,
    query => searchAutoComplete(query)
  )

  // return everything we need to have and use in components
  return {
    users: filteredUsers,
    loading,
    selectedUser,
    searchQuery,
    headers,
    searchAutoComplete,
    userForm,
    clearSelectedUser,
    clear,
    submitForm,
    fetchUsers,
    v$,
  }
})

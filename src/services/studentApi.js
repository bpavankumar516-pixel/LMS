import axios from 'axios';

const DUMMY_USERS_URL = 'https://dummyjson.com/users';

// Map DummyJSON User object to LMS Student format
const mapDummyUserToStudent = (u) => {
  const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || 'Student';
  const addressStr = u.address
    ? typeof u.address === 'string'
      ? u.address
      : `${u.address.address || ''}, ${u.address.city || ''}`.replace(/^,\s*/, '')
    : 'Hyderabad, India';

  return {
    id: String(u.id),
    name: fullName,
    email: u.email || `${u.username || 'student'}@gmail.com`,
    mobile: u.phone || '9876543210',
    qualification: u.university || u.company?.title || 'B.Tech',
    address: addressStr,
    enrollmentDate: u.birthDate || '2026-06-15',
    avatar: u.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  };
};

// GET: Fetch Students from DummyJSON Users API
export const getStudentsFromApi = async () => {
  try {
    const response = await axios.get(`${DUMMY_USERS_URL}?limit=30`);
    if (response.data && Array.isArray(response.data.users)) {
      const apiStudents = response.data.users.map(mapDummyUserToStudent);
      
      // Merge with any local added students in LocalStorage
      const localAdded = JSON.parse(localStorage.getItem('lms_local_added_students') || '[]');
      const localDeleted = JSON.parse(localStorage.getItem('lms_local_deleted_students') || '[]');
      const localUpdated = JSON.parse(localStorage.getItem('lms_local_updated_students') || '{}');

      // Filter out deleted IDs
      let combined = [...localAdded, ...apiStudents].filter(
        (s) => !localDeleted.includes(String(s.id))
      );

      // Apply updated fields
      combined = combined.map((s) => (localUpdated[s.id] ? { ...s, ...localUpdated[s.id] } : s));

      localStorage.setItem('lms_students', JSON.stringify(combined));
      return combined;
    }
  } catch (err) {
    console.warn('DummyJSON Users API fetch error, fallback to cached storage:', err);
  }

  const saved = localStorage.getItem('lms_students');
  return saved ? JSON.parse(saved) : [];
};

// POST: Add Student to DummyJSON Users API
export const addStudentApi = async (studentData) => {
  const nameParts = (studentData.name || '').split(' ');
  const firstName = nameParts[0] || 'Student';
  const lastName = nameParts.slice(1).join(' ') || 'User';

  try {
    const response = await axios.post(`${DUMMY_USERS_URL}/add`, {
      firstName,
      lastName,
      email: studentData.email,
      phone: studentData.mobile,
      university: studentData.qualification,
      address: { address: studentData.address, city: 'Hyderabad' }
    });

    const newStudent = mapDummyUserToStudent({
      ...response.data,
      id: response.data.id || Date.now(),
      firstName,
      lastName,
      email: studentData.email,
      phone: studentData.mobile,
      university: studentData.qualification,
      address: { address: studentData.address },
      birthDate: studentData.enrollmentDate || new Date().toISOString().split('T')[0]
    });

    // Store in local added list for persistence
    const localAdded = JSON.parse(localStorage.getItem('lms_local_added_students') || '[]');
    localStorage.setItem('lms_local_added_students', JSON.stringify([newStudent, ...localAdded]));

    return newStudent;
  } catch (err) {
    console.warn('DummyJSON Users API POST error, fallback:', err);
    return mapDummyUserToStudent({
      id: Date.now(),
      firstName,
      lastName,
      email: studentData.email,
      phone: studentData.mobile,
      university: studentData.qualification,
      address: { address: studentData.address },
      birthDate: studentData.enrollmentDate
    });
  }
};

// PUT: Update Student on DummyJSON Users API
export const updateStudentApi = async (id, updatedFields) => {
  const nameParts = (updatedFields.name || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  try {
    const response = await axios.put(`${DUMMY_USERS_URL}/${id}`, {
      firstName,
      lastName,
      email: updatedFields.email,
      phone: updatedFields.mobile,
      university: updatedFields.qualification
    });

    // Save updated fields locally
    const localUpdated = JSON.parse(localStorage.getItem('lms_local_updated_students') || '{}');
    localUpdated[id] = updatedFields;
    localStorage.setItem('lms_local_updated_students', JSON.stringify(localUpdated));

    return response.data;
  } catch (err) {
    console.warn('DummyJSON Users API PUT error, fallback:', err);
    const localUpdated = JSON.parse(localStorage.getItem('lms_local_updated_students') || '{}');
    localUpdated[id] = updatedFields;
    localStorage.setItem('lms_local_updated_students', JSON.stringify(localUpdated));
    return updatedFields;
  }
};

// DELETE: Delete Student on DummyJSON Users API
export const deleteStudentApi = async (id) => {
  try {
    await axios.delete(`${DUMMY_USERS_URL}/${id}`);
  } catch (err) {
    console.warn('DummyJSON Users API DELETE error, fallback:', err);
  }

  // Save deleted ID locally
  const localDeleted = JSON.parse(localStorage.getItem('lms_local_deleted_students') || '[]');
  if (!localDeleted.includes(String(id))) {
    localDeleted.push(String(id));
    localStorage.setItem('lms_local_deleted_students', JSON.stringify(localDeleted));
  }
};

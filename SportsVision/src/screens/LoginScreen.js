import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { login, saveAuthToStorage } from '../store/authSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../theme/ThemeContext';

const schema = Yup.object().shape({
  username: Yup.string().min(3, 'At least 3 characters').required('Required'),
  password: Yup.string().min(4, 'At least 4 characters').required('Required'),
});

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const onSubmit = (values) => {
    const user = { username: values.username };
    dispatch(login(user));
    dispatch(saveAuthToStorage(user));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.brand, { color: colors.primary }]}>SportsVision</Text>
      <Text style={[styles.title, { color: colors.text }]}>Login to continue</Text>
      <Formik initialValues={{ username: '', password: '' }} validationSchema={schema} onSubmit={onSubmit}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput placeholder="Username" placeholderTextColor={colors.muted} value={values.username} onChangeText={handleChange('username')} onBlur={handleBlur('username')} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} />
            {touched.username && errors.username ? <Text style={styles.error}>{errors.username}</Text> : null}

            <TextInput placeholder="Password" placeholderTextColor={colors.muted} value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')} secureTextEntry style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} />
            {touched.password && errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

            <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>

      <View style={styles.row}>
        <Text style={{ color: colors.muted }}>New here? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={[styles.link, { color: colors.accent }]}>Create account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  brand: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 16, textAlign: 'center', marginBottom: 18 },
  input: { borderWidth: 1, padding: 12, marginBottom: 8, borderRadius: 10 },
  button: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  link: { fontWeight: '700' },
  error: { color: '#ef4444', marginBottom: 8 },
});

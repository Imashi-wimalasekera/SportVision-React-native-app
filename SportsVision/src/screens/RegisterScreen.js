import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { login, saveAuthToStorage } from '../store/authSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../theme/ThemeContext';
import Logo from '../components/Logo';

const schema = Yup.object().shape({
  name: Yup.string().min(2, 'At least 2 characters').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Required'),
  confirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required'),
});

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const onSubmit = (values) => {
    const user = { username: values.name, email: values.email };
    dispatch(login(user));
    dispatch(saveAuthToStorage(user));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Logo size={84} />
      <View style={styles.wordArtWrap}>
        <Text style={[styles.appNameShadow, { color: colors.accent }]}>SportsVision</Text>
        <Text style={[styles.appName, { color: colors.text }]}>SportsVision</Text>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>Create an account</Text>
      <Formik initialValues={{ name: '', email: '', password: '', confirm: '' }} validationSchema={schema} onSubmit={onSubmit}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput placeholder="Full name" placeholderTextColor={colors.muted} value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} />
            {touched.name && errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

            <TextInput placeholder="Email" placeholderTextColor={colors.muted} value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')} keyboardType="email-address" autoCapitalize="none" style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} />
            {touched.email && errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

            <TextInput placeholder="Password" placeholderTextColor={colors.muted} value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')} secureTextEntry style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} />
            {touched.password && errors.password ? <Text style={styles.error}>{errors.password}</Text> : null}

            <TextInput placeholder="Confirm password" placeholderTextColor={colors.muted} value={values.confirm} onChangeText={handleChange('confirm')} onBlur={handleBlur('confirm')} secureTextEntry style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} />
            {touched.confirm && errors.confirm ? <Text style={styles.error}>{errors.confirm}</Text> : null}

            <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  wordArtWrap: { height: 70, justifyContent: 'center', alignItems: 'center', marginTop: 12, marginBottom: 6, position: 'relative' },
  appNameShadow: { position: 'absolute', top: 8, fontSize: 44, fontWeight: '900', transform: [{ translateY: 3 }, { translateX: 3 }], opacity: 0.9, textShadowColor: 'rgba(0,0,0,0.12)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2, fontFamily: 'Georgia' },
  appName: { fontSize: 44, fontWeight: '900', letterSpacing: 1.4, fontStyle: 'italic', textTransform: 'capitalize', textShadowColor: 'rgba(0,0,0,0.06)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1, fontFamily: 'Georgia' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, padding: 12, marginBottom: 8, borderRadius: 10, width: '100%' },
  button: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8, width: '100%' },
  buttonText: { color: '#fff', fontWeight: '700' },
  error: { color: '#ef4444', marginBottom: 8 },
});

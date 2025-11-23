import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { login, saveAuthToStorage } from '../store/authSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../theme/ThemeContext';
import Logo from '../components/Logo';

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
      <Logo size={100} />
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
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  wordArtWrap: { height: 80, justifyContent: 'center', alignItems: 'center', marginTop: 12, marginBottom: 6, position: 'relative' },
  appNameShadow: { position: 'absolute', top: 8, fontSize: 48, fontWeight: '900', transform: [{ translateY: 3 }, { translateX: 3 }], opacity: 0.9, textShadowColor: 'rgba(0,0,0,0.12)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2, fontFamily: 'Georgia' },
  appName: { fontSize: 48, fontWeight: '900', letterSpacing: 1.4, fontStyle: 'italic', textTransform: 'capitalize', textShadowColor: 'rgba(0,0,0,0.06)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1, fontFamily: 'Georgia' },
  title: { fontSize: 18, textAlign: 'center', marginBottom: 18 },
  input: { borderWidth: 1, padding: 12, marginBottom: 8, borderRadius: 10, width: '100%' },
  button: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8, width: '100%' },
  buttonText: { color: '#fff', fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  link: { fontWeight: '700' },
  error: { color: '#ef4444', marginBottom: 8 },
});

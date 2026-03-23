import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'pages/auth_page.dart';
import 'pages/dashboard_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Supabase using the project details from the React app
  await Supabase.initialize(
    url: 'https://crmsaxfhkgufjrpzzozd.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNybXNheGZoa2d1ZmpycHp6b3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MjM4NzQsImV4cCI6MjA4OTI5OTg3NH0.5GeH0udamh_Mz6UqxABBi5FbHSLixpxl_S-T4nHumUQ',
  );

  runApp(const ScribblyApp());
}

class ScribblyApp extends StatelessWidget {
  const ScribblyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Scribbly',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF38BDF8)),
      ),
      home: StreamBuilder<AuthState>(
        stream: Supabase.instance.client.auth.onAuthStateChange,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Scaffold(body: Center(child: CircularProgressIndicator()));
          }
          final session = snapshot.data?.session;
          if (session != null) {
            return const DashboardPage();
          }
          return const AuthPage();
        },
      ),
    );
  }
}

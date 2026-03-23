import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> aboutItems = [
      {'e': '🔒', 't': 'Zero API calls', 'd': 'No Gemini. No OpenAI. No internet after first model download.'},
      {'e': '⚡', 't': 'Microsoft TrOCR', 'd': 'Runs locally via ONNX/WebAssembly. Model: trocr-base-handwritten.'},
      {'e': '📦', 't': '~340MB one-time', 'd': 'Model downloads once, cached forever on your device.'},
      {'e': '🖊️', 't': 'Improved canvas', 'd': 'Pressure simulation, Bezier smoothing, writing guide lines.'},
      {'e': '🔄', 't': 'Reversal detection', 'd': 'Stroke-temporal analysis for b/d/p/q reversals.'},
      {'e': '🧩', 't': 'Fine-tunable', 'd': 'See Training tab to master dyslexia-specific exercises.'},
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 800),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildHeader(),
              const SizedBox(height: 24),
              ...aboutItems.map((item) => _buildAboutCard(item)),
              const SizedBox(height: 24),
              _buildPrivacyBanner(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF0A1A3A), Color(0xFF1D4ED8)]),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('ℹ️ About Scribbly', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
          const SizedBox(height: 4),
          const Text(
            'Local TrOCR · No API · No rate limits · Fully offline',
            style: TextStyle(color: Colors.white60, fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _buildAboutCard(Map<String, String> item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFEFF6FF)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(item['e']!, style: const TextStyle(fontSize: 24)),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item['t']!, style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w900, color: const Color(0xFF0F1729))),
                const SizedBox(height: 4),
                Text(item['d']!, style: const TextStyle(color: Color(0xFF475569), fontSize: 13, height: 1.5)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPrivacyBanner() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDF4),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF22C55E)),
      ),
      child: const Text(
        '✅ This app never sends any data to any server. All AI runs on your device. Child privacy is guaranteed by architecture, not just policy.',
        style: TextStyle(color: Color(0xFF166534), fontSize: 13, fontWeight: FontWeight.w600),
        textAlign: TextAlign.center,
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:async';

class FeelPage extends StatefulWidget {
  const FeelPage({super.key});

  @override
  State<FeelPage> createState() => _FeelPageState();
}

class _FeelPageState extends State<FeelPage> with SingleTickerProviderStateMixin {
  Map<String, dynamic>? _selectedMood;
  bool _isBreathing = false;
  String _breathText = 'Ready?';
  late AnimationController _breathingController;

  final List<Map<String, dynamic>> _moods = [
    {'e': '🌤️', 'l': 'Brilliant', 'c': const Color(0xFF38BDF8), 'b': const Color(0xFF0EA5E9)},
    {'e': '🌱', 'l': 'Growing', 'c': const Color(0xFF4ADE80), 'b': const Color(0xFF22C55E)},
    {'e': '🌊', 'l': 'Calm', 'c': const Color(0xFF818CF8), 'b': const Color(0xFF6366F1)},
    {'e': '☁️', 'l': 'Quiet', 'c': const Color(0xFF94A3B8), 'b': const Color(0xFF64748B)},
    {'e': '⛈️', 'l': 'Stormy', 'c': const Color(0xFFFB7185), 'b': const Color(0xFFE11D48)},
    {'e': '🌙', 'l': 'Tired', 'c': const Color(0xFFA78BFA), 'b': const Color(0xFF8B5CF6)},
  ];

  final List<List<Offset>> _scribbles = [];
  List<Offset> _currentScribble = [];

  @override
  void initState() {
    super.initState();
    _breathingController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    );
  }

  @override
  void dispose() {
    _breathingController.dispose();
    super.dispose();
  }

  void _startBreathing() {
    setState(() => _isBreathing = true);
    _breathingController.repeat(reverse: true);
    _runBreathingCycle();
  }

  void _runBreathingCycle() {
    const steps = ['Breathe In...', 'Hold...', 'Breathe Out...', 'Relax...'];
    int i = 0;
    Timer.periodic(const Duration(seconds: 3), (timer) {
      if (!mounted || !_isBreathing) {
        timer.cancel();
        return;
      }
      setState(() => _breathText = steps[i]);
      i = (i + 1) % steps.length;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width >= 768;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 1000),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(flex: 2, child: _buildMoodSection()),
                  const SizedBox(width: 24),
                  Expanded(flex: 1, child: _buildCalmZone()),
                ],
              ),
              if (_selectedMood != null) ...[
                const SizedBox(height: 24),
                _buildScribbleSection(),
              ],
              const SizedBox(height: 24),
              _buildDailyReminder(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMoodSection() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('How are you feeling right now?', style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w800, color: Colors.white)),
          const SizedBox(height: 8),
          Text('Choose a mood that matches your energy today.', style: GoogleFonts.plusJakartaSans(color: Colors.white60)),
          const SizedBox(height: 32),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 3,
            mainAxisSpacing: 16,
            crossAxisSpacing: 16,
            children: _moods.map((m) {
              bool isSelected = _selectedMood?['l'] == m['l'];
              return InkWell(
                onTap: () => setState(() => _selectedMood = m),
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  decoration: BoxDecoration(
                    color: isSelected ? m['c'] : Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: isSelected ? m['b'] : Colors.transparent, width: 2),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(m['e'], style: const TextStyle(fontSize: 40)),
                      const SizedBox(height: 4),
                      Text(m['l'], style: GoogleFonts.plusJakartaSans(color: isSelected ? Colors.white : Colors.white70, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildCalmZone() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        children: [
          Text('🫁 Calm Zone', style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
          const SizedBox(height: 32),
          ScaleTransition(
            scale: Tween(begin: 0.9, end: 1.1).animate(CurvedAnimation(parent: _breathingController, curve: Curves.easeInOut)),
            child: Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: const LinearGradient(colors: [Color(0xFF38BDF8), Color(0xFF4F46E5)]),
                boxShadow: [BoxShadow(color: const Color(0xFF38BDF8).withOpacity(0.4), blurRadius: 20, spreadRadius: 5)],
              ),
              alignment: Alignment.center,
              child: Text(_isBreathing ? _breathText : 'Start', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16)),
            ),
          ),
          const SizedBox(height: 32),
          if (!_isBreathing)
            ElevatedButton(
              onPressed: _startBreathing,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF38BDF8),
                foregroundColor: const Color(0xFF0F172A),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              ),
              child: const Text('Begin 4-4-4 breathing', style: TextStyle(fontWeight: FontWeight.bold)),
            )
          else
            TextButton(
              onPressed: () {
                setState(() => _isBreathing = false);
                _breathingController.stop();
              },
              child: const Text('Finish', style: TextStyle(color: Colors.white60)),
            ),
        ],
      ),
    );
  }

  Widget _buildScribbleSection() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: (_selectedMood!['c'] as Color).withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Draw or scribble how ${_selectedMood!['l']} feels:', style: GoogleFonts.outfit(fontSize: 18, color: Colors.white)),
          const SizedBox(height: 16),
          Container(
            height: 200,
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
            child: GestureDetector(
              onPanStart: (details) {
                setState(() {
                  _currentScribble = [details.localPosition];
                  _scribbles.add(_currentScribble);
                });
              },
              onPanUpdate: (details) {
                setState(() => _currentScribble.add(details.localPosition));
              },
              child: CustomPaint(
                painter: ScribblePainter(_scribbles),
                size: Size.infinite,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDailyReminder() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF4F46E5), Color(0xFF06B6D4)]),
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('DAILY REMINDER', style: TextStyle(color: Colors.white70, fontWeight: FontWeight.w800, fontSize: 12, letterSpacing: 1.2)),
          const SizedBox(height: 12),
          Text(
            '"Your unique brain is a gift, not a burden. You see the world in colors others haven\'t discovered yet."',
            style: GoogleFonts.plusJakartaSans(fontSize: 20, color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}

class ScribblePainter extends CustomPainter {
  final List<List<Offset>> scribbles;
  ScribblePainter(this.scribbles);
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFF1E293B)..strokeWidth = 3.0..strokeCap = StrokeCap.round..style = PaintingStyle.stroke;
    for (final scribble in scribbles) {
      if (scribble.length < 2) continue;
      final path = Path()..moveTo(scribble[0].dx, scribble[0].dy);
      for (int i = 1; i < scribble.length; i++) path.lineTo(scribble[i].dx, scribble[i].dy);
      canvas.drawPath(path, paint);
    }
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

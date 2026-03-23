import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_tts/flutter_tts.dart';

class TrainingPage extends StatefulWidget {
  const TrainingPage({super.key});

  @override
  State<TrainingPage> createState() => _TrainingPageState();
}

class _TrainingPageState extends State<TrainingPage> {
  final FlutterTts flutterTts = FlutterTts();
  
  final List<Map<String, dynamic>> _pairs = [
    {'pair': ['b', 'd'], 'hint': '"b" has a belly, "d" has a diaper.', 'sound': 'bee and dee'},
    {'pair': ['p', 'q'], 'hint': '"p" faces right, "q" faces left.', 'sound': 'pea and cue'},
    {'pair': ['m', 'n'], 'hint': 'Count the humps!', 'sound': 'mmm and nnn'},
    {'pair': ['w', 'v'], 'hint': 'Sharp vs Round turns.', 'sound': 'double-you and vee'},
  ];

  late Map<String, dynamic> _selectedPair;
  late String _activeLetter;
  final List<List<Offset>> _traces = [];
  List<Offset> _currentTrace = [];

  @override
  void initState() {
    super.initState();
    _selectedPair = _pairs[0];
    _activeLetter = _selectedPair['pair'][0];
  }

  Future<void> _speak(String txt) async {
    await flutterTts.setSpeechRate(0.4);
    await flutterTts.speak(txt);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(flex: 1, child: _buildSidebar()),
          const SizedBox(width: 24),
          Expanded(flex: 3, child: _buildMainContent()),
        ],
      ),
    );
  }

  Widget _buildSidebar() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Phonetic Lab 🧪', style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 8),
          Text('Master commonly confused letters with sight and sound.', style: GoogleFonts.plusJakartaSans(fontSize: 14, color: Colors.white60)),
          const SizedBox(height: 32),
          ..._pairs.map((p) {
            bool isSelected = _selectedPair == p;
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: InkWell(
                onTap: () => setState(() {
                  _selectedPair = p;
                  _activeLetter = p['pair'][0];
                  _traces.clear();
                }),
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: isSelected ? const Color(0xFF38BDF8) : Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${p['pair'][0]} vs ${p['pair'][1]}',
                    style: GoogleFonts.plusJakartaSans(
                      color: isSelected ? const Color(0xFF0F172A) : Colors.white,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                    ),
                  ),
                ),
              ),
            );
          }),
          const Spacer(),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF38BDF8).withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF38BDF8).withOpacity(0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('MNEMONIC', style: TextStyle(color: Color(0xFF38BDF8), fontSize: 10, fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                Text(_selectedPair['hint'], style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMainContent() {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: (_selectedPair['pair'] as List).map((l) {
              bool isActive = _activeLetter == l;
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8),
                child: InkWell(
                  onTap: () => setState(() {
                    _activeLetter = l;
                    _traces.clear();
                    _speak(l);
                  }),
                  borderRadius: BorderRadius.circular(32),
                  child: Container(
                    width: 64,
                    height: 64,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: isActive ? const Color(0xFF38BDF8) : Colors.white.withOpacity(0.05),
                      shape: BoxShape.circle,
                    ),
                    child: Text(l, style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w900, color: isActive ? const Color(0xFF0F172A) : Colors.white)),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 32),
          Expanded(
            child: Stack(
              children: [
                Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 10)],
                  ),
                  child: Center(
                    child: Text(
                      _activeLetter,
                      style: GoogleFonts.outfit(
                        fontSize: 300,
                        fontWeight: FontWeight.w900,
                        color: Colors.grey.withOpacity(0.1),
                      ),
                    ),
                  ),
                ),
                GestureDetector(
                  onPanStart: (details) {
                    setState(() {
                      _currentTrace = [details.localPosition];
                      _traces.add(_currentTrace);
                    });
                  },
                  onPanUpdate: (details) {
                    setState(() => _currentTrace.add(details.localPosition));
                  },
                  onPanEnd: (_) {
                    _speak(_activeLetter);
                  },
                  child: CustomPaint(
                    painter: TracePainter(_traces),
                    size: Size.infinite,
                  ),
                ),
                Positioned(
                  top: 20,
                  right: 20,
                  child: IconButton(
                    icon: const Icon(Icons.refresh, color: Colors.grey),
                    onPressed: () => setState(() => _traces.clear()),
                  ),
                ),
                const Positioned(
                  bottom: 20,
                  left: 20,
                  child: Text('TRACE THE GHOST LETTER ABOVE', style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w800)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Hearing Awareness', style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                  Text('The sound of "$_activeLetter" is played when you finish tracing.', style: const TextStyle(color: Colors.white38, fontSize: 13)),
                ],
              ),
              ElevatedButton.icon(
                onPressed: () => _speak(_activeLetter),
                icon: const Icon(Icons.volume_up_outlined),
                label: const Text('Listen Again'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F172A),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: const BorderSide(color: Colors.white10)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class TracePainter extends CustomPainter {
  final List<List<Offset>> traces;
  TracePainter(this.traces);
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = const Color(0xFF38BDF8)..strokeWidth = 15.0..strokeCap = StrokeCap.round..style = PaintingStyle.stroke;
    for (final trace in traces) {
      if (trace.length < 2) continue;
      final path = Path()..moveTo(trace[0].dx, trace[0].dy);
      for (int i = 1; i < trace.length; i++) path.lineTo(trace[i].dx, trace[i].dy);
      canvas.drawPath(path, paint);
    }
  }
  @override
  bool shouldRepaint(covariant TracePainter oldDelegate) => true;
}

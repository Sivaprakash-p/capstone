import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class WritingPage extends StatefulWidget {
  const WritingPage({super.key});

  @override
  State<WritingPage> createState() => _WritingPageState();
}

class _WritingPageState extends State<WritingPage> {
  final List<List<Offset>> _strokes = [];
  List<Offset> _currentStroke = [];
  String _result = '';
  bool _isLoading = false;
  String _status = 'Ready for input';

  final String _googleUrl = 'https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8';

  void _undo() {
    if (_strokes.isNotEmpty) {
      setState(() {
        _strokes.removeLast();
        _status = 'Undo performed';
      });
    }
  }

  void _clear() {
    setState(() {
      _strokes.clear();
      _result = '';
      _status = 'Canvas cleared';
    });
  }

  Future<void> _recognize() async {
    if (_strokes.isEmpty) return;

    setState(() {
      _isLoading = true;
      _status = 'Predicting...';
    });

    try {
      final List ink = _strokes.map((stroke) {
        return [
          stroke.map((p) => p.dx.toInt()).toList(),
          stroke.map((p) => p.dy.toInt()).toList(),
          stroke.map((_) => DateTime.now().millisecondsSinceEpoch).toList(),
        ];
      }).toList();

      final response = await http.post(
        Uri.parse(_googleUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'options': 'enable_pre_space',
          'requests': [{
            'writing_guide': {
              'writing_area_width': 800, // Placeholder, can be dynamic
              'writing_area_height': 600
            },
            'pre_context': '',
            'max_num_results': 1,
            'max_completions': 0,
            'language': 'en',
            'itc': 'en-t-i0-handwrit',
            'ink': ink
          }]
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data[0] == 'SUCCESS') {
          setState(() {
            _result = data[1][0][1][0];
            _status = 'Predicted successfully';
          });
        } else {
          setState(() => _status = 'Recognition failed');
        }
      } else {
        setState(() => _status = 'Server error');
      }
    } catch (e) {
      setState(() => _status = 'Prediction error');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          _buildHeader(),
          const SizedBox(height: 24),
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(
                  flex: 3,
                  child: _buildCanvas(),
                ),
                const SizedBox(width: 24),
                Expanded(
                  flex: 1,
                  child: _buildResultPanel(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          _buildFooter(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Text('✨', style: TextStyle(fontSize: 24)),
              const SizedBox(width: 12),
              Text(
                'Infinity Ink',
                style: GoogleFonts.outfit(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          Row(
            children: [
              _buildToolButton(Icons.undo, _undo, 'Undo'),
              const SizedBox(width: 12),
              _buildToolButton(Icons.delete_outline, _clear, 'Clear'),
              const SizedBox(width: 12),
              ElevatedButton(
                onPressed: _isLoading ? null : _recognize,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF38BDF8),
                  foregroundColor: const Color(0xFF0F172A),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('Convert to Text', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildToolButton(IconData icon, VoidCallback onPressed, String tooltip) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
      ),
      child: IconButton(
        icon: Icon(icon, color: Colors.white70, size: 20),
        onPressed: onPressed,
        tooltip: tooltip,
      ),
    );
  }

  Widget _buildCanvas() {
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 10)],
      ),
      child: Stack(
        children: [
          GestureDetector(
            onPanStart: (details) {
              setState(() {
                _currentStroke = [details.localPosition];
                _strokes.add(_currentStroke);
              });
            },
            onPanUpdate: (details) {
              setState(() {
                _currentStroke.add(details.localPosition);
              });
            },
            onPanEnd: (_) {
              _currentStroke = [];
            },
            child: CustomPaint(
              painter: DrawingPainter(_strokes),
              size: Size.infinite,
            ),
          ),
          if (_isLoading)
            Container(
              color: const Color(0xFF0F172A).withOpacity(0.8),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const CircularProgressIndicator(color: Color(0xFF38BDF8)),
                    const SizedBox(height: 16),
                    Text('Analyzing Strokes...', style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.bold)),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildResultPanel() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'RESULT',
                style: GoogleFonts.outfit(
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                  color: Colors.white38,
                  letterSpacing: 1.2,
                ),
              ),
              const Icon(Icons.copy, color: Colors.white38, size: 18),
            ],
          ),
          Expanded(
            child: Center(
              child: Text(
                _result.isEmpty ? '...' : _result,
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  fontSize: 48,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFooter() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _isLoading ? Colors.orange : Colors.green,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              _status,
              style: GoogleFonts.plusJakartaSans(
                fontSize: 12,
                color: Colors.white38,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
        Text(
          'Converted using Google Input Tools',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12,
            color: Colors.white38,
          ),
        ),
      ],
    );
  }
}

class DrawingPainter extends CustomPainter {
  final List<List<Offset>> strokes;

  DrawingPainter(this.strokes);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF1E293B)
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..strokeWidth = 5.0
      ..style = PaintingStyle.stroke;

    for (final stroke in strokes) {
      if (stroke.isEmpty) continue;
      final path = Path();
      path.moveTo(stroke[0].dx, stroke[0].dy);
      for (int i = 1; i < stroke.length; i++) {
        path.lineTo(stroke[i].dx, stroke[i].dy);
      }
      canvas.drawPath(path, paint);
    }
  }

  @override
  bool shouldRepaint(covariant DrawingPainter oldDelegate) => true;
}
